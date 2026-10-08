"use client"

import React from "react"
import Link from "next/link"
import { Play, ArrowLeft, Clock } from "lucide-react"

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-sm">
        
        <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <Play className="w-8 h-8 text-purple-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Video Tutorials</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Our step-by-step video courses and feature walkthrough library are currently in production.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-center gap-2.5 text-xs font-bold text-slate-400">
          <Clock className="w-4 h-4 text-slate-500" />
          Coming Soon in Version 1.1
        </div>

        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
