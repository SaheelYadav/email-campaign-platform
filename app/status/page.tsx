"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  Calendar,
  Activity,
  Server,
  TrendingUp,
  Database,
  Mail,
  Users,
  Layout,
  Layers
} from "lucide-react"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down" | "offline"
  latency: number
}

interface StatusApiResponse {
  generatedAt: string
  overallStatus: "operational" | "degraded" | "down"
  responseTime: number
  services: ServiceStatus[]
  metrics: {
    totalCampaigns: number
    totalContacts: number
    totalTemplates: number
    emailsSentToday: number
    emailsSentThisWeek: number
    pendingQueue: number
    openRate: number
    clickRate: number
    databaseLatency: number
    averageApiResponseTime: number
    emailHeartbeatAge: number
    analyticsHeartbeatAge: number
  }
  incidents: Array<{
    id: string
    title: string
    status: string
    severity: string
    createdAt: string
  }>
}

export default function StatusPage() {
  const [data, setData] = useState<StatusApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStatus = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true)
    try {
      const res = await fetch("/api/system/status")
      if (!res.ok) throw new Error("Failed to retrieve system status data")
      const json: StatusApiResponse = await res.json()
      setData(json)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred while fetching system health.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Auto-refresh status data every 20 seconds
    const interval = setInterval(() => {
      fetchStatus(true)
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "operational":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          bg: "bg-emerald-500/10 border-emerald-500/20",
          text: "Operational",
          color: "text-emerald-500"
        }
      case "degraded":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          bg: "bg-amber-500/10 border-amber-500/20",
          text: "Degraded Performance",
          color: "text-amber-500"
        }
      case "down":
      case "offline":
      default:
        return {
          icon: <XCircle className="w-5 h-5 text-rose-500" />,
          bg: "bg-rose-500/10 border-rose-500/20",
          text: "Down / Offline",
          color: "text-rose-500"
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Querying platform status metrics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-5 shadow-sm">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connection Error</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {error || "Could not load health metrics from the API."}
          </p>
          <button 
            onClick={() => { setIsLoading(true); fetchStatus(); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Retry Check
          </button>
        </div>
      </div>
    )
  }

  const overallDetails = getStatusDetails(data.overallStatus)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MailFlow System Health
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 animate-pulse flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Live Monitoring
            </span>
            <button 
              onClick={() => fetchStatus(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Overall Status Badge Banner */}
        <div className={`border rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-all ${overallDetails.bg}`}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 dark:bg-slate-900/40 flex items-center justify-center border border-white/10">
              {overallDetails.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {data.overallStatus === "operational" ? "All Systems Operational" : "Active System Incidents Detected"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {data.overallStatus === "operational" 
                  ? "MailFlow services are operating normally and executing message dispatches."
                  : "We have detected degradation on one or more services. Our operations team is investigating."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Updated: {new Date(data.generatedAt).toLocaleTimeString()}
          </div>
        </div>

        {/* Dashboard Live Metrics Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Platform Usage Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Total Campaigns</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{data.metrics.totalCampaigns}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Active Contacts</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{data.metrics.totalContacts}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Dispatched Today</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{data.metrics.emailsSentToday}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Open / Click Rate</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {data.metrics.openRate}% / {data.metrics.clickRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Services Status Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-500" /> Subsystem Heartbeats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.services.map((srv) => {
              const details = getStatusDetails(srv.status)
              return (
                <div 
                  key={srv.name}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">{srv.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">
                      {srv.name.includes("Worker") 
                        ? `Last heartbeat: ${Math.round(srv.latency / 1000)}s ago`
                        : `Latency: ${srv.latency}ms`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold ${details.color}`}>{details.text}</span>
                    {details.icon}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Incidents & Maintenance logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Incidents */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Live Incidents ({data.incidents.length})
            </h3>
            {data.incidents.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">
                No active incidents reported. All subsystems operating within normal performance bounds.
              </div>
            ) : (
              <div className="space-y-3">
                {data.incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">{inc.title}</span>
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase rounded-full">
                        {inc.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Severity: {inc.severity}</span>
                      <span>Detected: {new Date(inc.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance schedules */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" /> Scheduled Maintenance
            </h3>
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">
              No scheduled maintenance windows. System upgrades are executed with zero-downtime rolling deployments.
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
