"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Play, 
  Building,
  Users, 
  Mail, 
  Send, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  AlertTriangle,
  ChevronRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink,
  Info,
  Compass,
  FileText,
  Clock,
  Sparkles,
  Search,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"

interface DocSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "")
        const validSections = [
          "intro", 
          "getting-started", 
          "organization-setup", 
          "contacts", 
          "templates", 
          "campaigns", 
          "analytics", 
          "settings", 
          "faq", 
          "troubleshooting"
        ]
        if (validSections.includes(hash)) {
          setActiveSection(hash)
        }
      }
    }
    
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const sections: DocSection[] = [
    {
      id: "intro",
      title: "Introduction",
      icon: <BookOpen className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Introduction to MailFlow</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              MailFlow is a premium, commercial SaaS email marketing and audience engagement platform. Built for marketing professionals, business owners, enterprise communication teams, and growth leaders, MailFlow simplifies the process of designing beautiful, highly-personalized newsletters, managing large subscriber audiences, and tracking campaign performance with real-time analytics.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Core Platform Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Drag-and-Drop Editor</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Design professional newsletters with zero coding. Mix and match pre-designed layouts, drop in responsive action buttons, customize typography, and review live previews.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Smart Contact Segmentation</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Organize your subscriber list using tag folders and custom profile fields. Filter your contacts dynamically with condition rules to deliver contextually targeted campaigns.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Precise Tracking & Reports</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Analyze subscriber engagement. Measure delivery rates, open actions, link click locations, and unsubscribe metrics instantly.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Enterprise Brand Settings</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Align sender details, logotypes, support headers, and address footprints across your team's workspace to match brand identity rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Play className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Getting Started</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Walk through our step-by-step roadmap to dispatching your first campaign.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">1</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Complete Your Organization Profile</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Go to **Settings &gt; Organization**. Set your default sender name, timezone, company address, and upload your brand logo. These branding values populate all subsequent campaign templates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">2</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Verify Your Sending Identity</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Confirm your sender identity inside **Settings &gt; Verification**. Make sure you verify the sender email address to allow campaigns to pass deliverability filters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">3</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Import Contacts</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Navigate to **Contacts &gt; Import**. Upload your customer list using a CSV or XLSX spreadsheet. Map your columns to MailFlow contact attributes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">4</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Create a Contact List</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Create static list folders under **Contacts &gt; Lists** to categorize your audiences (e.g., "Product Updates", "Event Registrants").
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">5</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Build Your First Email Template</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Open the **Templates** panel. Pick a style layout and customize content using our drag-and-drop builder blocks, adding merge tags like <code>{"{{firstName}}"}</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">6</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Create and Target a Campaign</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Go to **Campaigns &gt; New Campaign**. Fill in subject details, select target audience lists or segment filters, and link your custom email template.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">7</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Preview, Test, and Dispatch</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Review the layout preview, send a free test email to your inbox, and choose whether to send immediately or schedule the launch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">8</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Monitor Performance Analytics</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Access your **Dashboard** and **Campaign Reports** to observe real-time open notifications, click-through rates, and recipient delivery metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "organization-setup",
      title: "Organization Setup",
      icon: <Building className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Organization Setup</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Establish your corporate identity, branding assets, and verified senders.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Navigate to **Settings &gt; Organization Setup** to input your default branding parameters. Here you can upload your corporate logotype (`.png` or `.webp`), set default footer addresses, choose default sending identities, and establish local timezones for campaign scheduling.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sender Identity Verification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To send emails through MailFlow, you must authorize your sender address. Go to **Settings &gt; Senders**, input your sender email (e.g. `newsletter@yourdomain.com`), and complete the validation instructions sent to your inbox. This ensures high deliverability rates and prevents your messages from landing in the spam folder.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "contacts",
      title: "Audience & Contacts",
      icon: <Users className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Audience & Contacts</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Manage profiles, custom data variables, tags, lists, and segments.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" /> Advanced Audience Tools
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Duplicate Detection</strong>: MailFlow automatically flags duplicate email records during CSV imports and prevents multiple deliveries to the same address within a single campaign run.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Segments</strong>: Dynamic filters sorting your contacts in real time (e.g., Contacts tagged with "VIP" whose Custom Field "Country" equals "USA").
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Custom Fields</strong>: Metadata tags (e.g. Job Title, Account Value) mapped to merge tags for campaign customization.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Importing Contacts via CSV/XLSX</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To import subscribers, prepare a UTF-8 encoded spreadsheet. Navigate to **Contacts &gt; Import**, upload your file, and map your table column headers to the corresponding database field targets (First Name, Email, Custom Fields).
            </p>
          </div>
        </div>
      )
    },
    {
      id: "templates",
      title: "Email Builder & Templates",
      icon: <Mail className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Email Builder & Templates</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Create responsive HTML newsletters using our visual drag-and-drop customizer.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drag & Drop Editor Features</h3>
            <ul className="space-y-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <li>
                <strong>Content Blocks</strong>: Drop images, text components, headers, dividers, and call-to-action buttons.
              </li>
              <li>
                <strong>Rich Text & HTML Support</strong>: Write with rich text styles or toggle raw HTML mode for customized coding templates.
              </li>
              <li>
                <strong>Testing Suite</strong>: Send a draft test copy directly to your inbox to audit email clients display rendering.
              </li>
              <li>
                <strong>Responsive Styles</strong>: Tweak mobile styles independently inside the device switcher menu.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "campaigns",
      title: "Campaign Management",
      icon: <Send className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Campaign Management</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Draft, schedule, verify, and launch campaigns.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drafting and Scheduling</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create campaigns inside the **Campaigns** dashboard. You can customize recipient targets, link custom templates, and preview delivery details. Select **Send Now** to dispatch immediately, or click **Schedule** to program automatic dispatch matching your target timezone.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Duplicate and Management Tools</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage your marketing schedules by duplicating successful campaign drafts, checking historic delivery logs, and reviewing performance statistics.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "analytics",
      title: "Analytics & Performance Reports",
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Campaign Performance Analytics</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Review subscriber campaign engagement reports and live event tracking metrics.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Understanding Campaign Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-slate-500 uppercase">Open Rate</span>
                <p className="text-xs text-slate-600 mt-1">The percentage of recipients who viewed or opened the message.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-slate-500 uppercase">Click-Through Rate (CTR)</span>
                <p className="text-xs text-slate-600 mt-1">The percentage of recipients who clicked links inside your template.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-slate-500 uppercase">Delivery & Bounce Rate</span>
                <p className="text-xs text-slate-600 mt-1">Tracks successful deliveries vs. bounces and spam complaints.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions (FAQ)</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Clear, practical answers for common platform tasks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white">How do I import contacts?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Go to the **Contacts** tab, click **Import**, upload your CSV/XLSX, and map columns to MailFlow attributes.
              </p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white">Can I duplicate template files?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Yes. Click the context menu (...) icon on any saved template card and choose **Duplicate**.
              </p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white">How do merge tags work?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Insert brackets like <code>{"{{firstName}}"}</code> in text fields. MailFlow automatically replaces them on dispatch.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <AlertTriangle className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Troubleshooting Support</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Troubleshoot newsletter layout errors, contact uploads, and delivery problems.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <h4 className="font-bold text-slate-900 dark:text-white">Campaign stuck in "Draft" state</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Confirm you mapped a verified sender email and selected a valid recipient audience list or segment.
              </p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <h4 className="font-bold text-slate-900 dark:text-white">Images not displaying for subscribers</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Check that image files are hosted on public servers and link to secure, absolute addresses beginning with `https://`.
              </p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <h4 className="font-bold text-slate-900 dark:text-white">CSV import fails or skips rows</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Confirm your CSV contains valid, properly structured email formats, has no blank email columns, and is saved in UTF-8 format.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MailFlow Resources
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 tracking-wider">
              HELP CENTER
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl text-xs font-bold shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            Client Center
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === sec.id 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  {sec.icon}
                  {sec.title}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === sec.id ? "rotate-90" : "opacity-30"}`} />
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Side: Content Frame */}
        <main className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-w-0">
          {sections.find(sec => sec.id === activeSection)?.content}
        </main>

      </div>
    </div>
  )
}
