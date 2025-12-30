"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { PatientInfoCard } from "@/components/PatientInfoCard"
import { AgentPanel } from "@/components/AgentPanel"
import { ChatInterface } from "@/components/ChatInterface"
import { ClinicalNotesPanel } from "@/components/ClinicalNotesPanel"

export default function Home() {
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [clinicalNotes, setClinicalNotes] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info & Agent Status */}
          <div className="space-y-6">
            <PatientInfoCard />
            <AgentPanel activeAgents={activeAgents} />
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface
              onAgentsChange={setActiveAgents}
              onNotesGenerated={setClinicalNotes}
            />
          </div>

          {/* Right Column - Clinical Notes */}
          <div>
            <ClinicalNotesPanel notes={clinicalNotes} />
          </div>
        </div>
      </main>
    </div>
  )
}
