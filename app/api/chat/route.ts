import { NextRequest, NextResponse } from "next/server"
import { AgentOrchestrator } from "@/lib/agents/agent-orchestrator"

// Initialize the agent orchestrator
const orchestrator = new AgentOrchestrator()

// Demo patient context
const patientContext = {
  name: "Sarah Johnson",
  age: 58,
  gender: "Female",
  chiefComplaint: "Follow-up for diabetes and hypertension management",
  conditions: ["Type 2 Diabetes", "Hypertension"],
  medications: ["Metformin 1000mg BID", "Lisinopril 20mg daily"],
  vitals: {
    "BP": "138/86 mmHg",
    "HR": "76 bpm",
    "Temp": "98.4°F",
    "SpO2": "98%",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      )
    }

    // Process the request through the agent orchestrator
    const result = await orchestrator.processRequest(message, patientContext)

    return NextResponse.json({
      response: result.response,
      activeAgents: result.activeAgents,
      agentOutputs: result.agentOutputs,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
