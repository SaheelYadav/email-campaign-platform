import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { SESv2Client, GetAccountCommand } from "@aws-sdk/client-sesv2"
import { SQSClient, GetQueueAttributesCommand } from "@aws-sdk/client-sqs"

const prisma = new PrismaClient()

// Initialize AWS Clients safely
const getSesClient = () => {
  return new SESv2Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

const getSqsClient = () => {
  return new SQSClient({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

export async function GET() {
  const generatedAt = new Date().toISOString()
  const startTotal = Date.now()

  // Helper function to measure execution of a check
  const measureCheck = async (fn: () => Promise<any>) => {
    const start = Date.now()
    try {
      await fn()
      return { status: "operational" as const, latency: Date.now() - start }
    } catch (err: any) {
      console.error("Health check failure:", err.message)
      return { status: "down" as const, latency: Date.now() - start, error: err.message }
    }
  }

  // Define parallel health checks
  const checks = {
    database: async () => {
      await prisma.$queryRaw`SELECT 1`
    },
    campaignEngine: async () => {
      await prisma.campaign.count()
    },
    templateEngine: async () => {
      await prisma.emailTemplate.count()
    },
    contactManagement: async () => {
      await prisma.contact.count()
      await prisma.contactCustomField.count()
    },
    trackingEngine: async () => {
      await prisma.trackedLink.count()
    },
    openTracking: async () => {
      await prisma.emailOpenEvent.count()
    },
    clickTracking: async () => {
      await prisma.emailClickEvent.count()
    },
    authentication: async () => {
      await prisma.session.count()
    },
    awsSes: async () => {
      const ses = getSesClient()
      await ses.send(new GetAccountCommand({}))
    },
    awsSqs: async () => {
      const sqs = getSqsClient()
      const queueUrl = process.env.AWS_ANALYTICS_QUEUE_URL || ""
      if (!queueUrl) throw new Error("AWS_ANALYTICS_QUEUE_URL is not set")
      await sqs.send(new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["ApproximateNumberOfMessages"]
      }))
    }
  }

  // Execute all checks in parallel
  const keys = Object.keys(checks) as Array<keyof typeof checks>
  const results = await Promise.all(keys.map(k => measureCheck(checks[k])))

  const serviceResults = keys.reduce((acc, key, i) => {
    acc[key] = results[i]
    return acc
  }, {} as Record<string, { status: "operational" | "down"; latency: number; error?: string }>)

  // Fetch Heartbeats for worker status
  let emailWorkerStatus = "offline"
  let analyticsWorkerStatus = "offline"
  let emailHeartbeatAge = -1
  let analyticsHeartbeatAge = -1

  try {
    const heartbeats = await prisma.workerHeartbeat.findMany()
    const now = Date.now()

    // Find latest email worker heartbeat
    const emailWorkers = heartbeats.filter(h => h.id.startsWith("email-worker-"))
    if (emailWorkers.length > 0) {
      const latestEmailWorker = emailWorkers.reduce((prev, current) => 
        (new Date(prev.lastSeenAt).getTime() > new Date(current.lastSeenAt).getTime()) ? prev : current
      )
      emailHeartbeatAge = Math.round((now - new Date(latestEmailWorker.lastSeenAt).getTime()) / 1000)
      emailWorkerStatus = emailHeartbeatAge < 45 ? "operational" : "offline"
    }

    // Find latest analytics worker heartbeat
    const analyticsWorkers = heartbeats.filter(h => h.id.startsWith("analytics-worker-"))
    if (analyticsWorkers.length > 0) {
      const latestAnalyticsWorker = analyticsWorkers.reduce((prev, current) => 
        (new Date(prev.lastSeenAt).getTime() > new Date(current.lastSeenAt).getTime()) ? prev : current
      )
      analyticsHeartbeatAge = Math.round((now - new Date(latestAnalyticsWorker.lastSeenAt).getTime()) / 1000)
      analyticsWorkerStatus = analyticsHeartbeatAge < 45 ? "operational" : "offline"
    }
  } catch (err: any) {
    console.error("Failed to query worker heartbeats:", err.message)
  }

  // Fetch Metrics from Database
  let totalCampaigns = 0
  let totalContacts = 0
  let totalTemplates = 0
  let emailsSentToday = 0
  let emailsSentThisWeek = 0
  let pendingQueue = 0
  let openRate = 0
  let clickRate = 0

  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)

    const [
      campaignCount,
      contactCount,
      templateCount,
      sentToday,
      sentThisWeek,
      pendingCount,
      campaignStats
    ] = await Promise.all([
      prisma.campaign.count(),
      prisma.contact.count(),
      prisma.emailTemplate.count(),
      prisma.emailDelivery.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.emailDelivery.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.emailDelivery.count({ where: { status: "SENDING" } }),
      prisma.campaign.aggregate({
        _sum: {
          totalSent: true,
          totalOpened: true,
          totalClicked: true
        }
      })
    ])

    totalCampaigns = campaignCount
    totalContacts = contactCount
    totalTemplates = templateCount
    emailsSentToday = sentToday
    emailsSentThisWeek = sentThisWeek
    pendingQueue = pendingCount

    const totalSent = campaignStats._sum.totalSent || 0
    if (totalSent > 0) {
      openRate = parseFloat(((campaignStats._sum.totalOpened || 0) / totalSent * 100).toFixed(2))
      clickRate = parseFloat(((campaignStats._sum.totalClicked || 0) / totalSent * 100).toFixed(2))
    }
  } catch (err: any) {
    console.error("Failed to compute platform metrics:", err.message)
  }

  // Determine Overall Status
  let overallStatus: "operational" | "degraded" | "down" = "operational"
  const isAnyDown = Object.values(serviceResults).some(r => r.status === "down") || 
                    emailWorkerStatus === "offline" || 
                    analyticsWorkerStatus === "offline"

  if (isAnyDown) {
    overallStatus = "down"
  }

  const responseTime = Date.now() - startTotal

  // Format Dynamic incident list from status
  const incidents = []
  if (emailWorkerStatus === "offline") {
    incidents.push({
      id: "email-worker-offline",
      title: "Email Dispatch Worker Offline",
      status: "investigating",
      severity: "major",
      createdAt: new Date().toISOString()
    })
  }
  if (analyticsWorkerStatus === "offline") {
    incidents.push({
      id: "analytics-worker-offline",
      title: "Analytics Tracking Worker Offline",
      status: "investigating",
      severity: "minor",
      createdAt: new Date().toISOString()
    })
  }
  if (serviceResults.database.status === "down") {
    incidents.push({
      id: "db-connectivity-down",
      title: "Database Cluster Connectivity Issues",
      status: "identified",
      severity: "major",
      createdAt: new Date().toISOString()
    })
  }

  return NextResponse.json({
    generatedAt,
    overallStatus,
    responseTime,
    services: [
      { name: "Dashboard", status: serviceResults.database.status, latency: serviceResults.database.latency },
      { name: "Authentication", status: serviceResults.authentication.status, latency: serviceResults.authentication.latency },
      { name: "Email Delivery Engine", status: serviceResults.awsSes.status, latency: serviceResults.awsSes.latency },
      { name: "Campaign Engine", status: serviceResults.campaignEngine.status, latency: serviceResults.campaignEngine.latency },
      { name: "Contact Management", status: serviceResults.contactManagement.status, latency: serviceResults.contactManagement.latency },
      { name: "Template Builder", status: serviceResults.templateEngine.status, latency: serviceResults.templateEngine.latency },
      { name: "Analytics Processor", status: serviceResults.trackingEngine.status, latency: serviceResults.trackingEngine.latency },
      { name: "Tracking Redirects", status: serviceResults.trackingEngine.status, latency: serviceResults.trackingEngine.latency },
      { name: "AWS SES Integration", status: serviceResults.awsSes.status, latency: serviceResults.awsSes.latency },
      { name: "AWS SQS Dispatcher", status: serviceResults.awsSqs.status, latency: serviceResults.awsSqs.latency },
      { name: "Database Cluster", status: serviceResults.database.status, latency: serviceResults.database.latency },
      { name: "Email Dispatch Worker", status: emailWorkerStatus, latency: emailHeartbeatAge >= 0 ? emailHeartbeatAge * 1000 : 0 },
      { name: "Analytics Worker", status: analyticsWorkerStatus, latency: analyticsHeartbeatAge >= 0 ? analyticsHeartbeatAge * 1000 : 0 }
    ],
    metrics: {
      totalCampaigns,
      totalContacts,
      totalTemplates,
      emailsSentToday,
      emailsSentThisWeek,
      pendingQueue,
      openRate,
      clickRate,
      databaseLatency: serviceResults.database.latency,
      averageApiResponseTime: responseTime,
      emailHeartbeatAge,
      analyticsHeartbeatAge
    },
    incidents
  })
}
