/**
 * Agent Orchestrator
 * Coordinates multiple AI agents and routes requests to appropriate specialists
 */

import { ResearchAgent } from "./research-agent"
import { DocumentationAgent } from "./documentation-agent"
import { DrugInteractionAgent } from "./drug-interaction-agent"
import { BaseAgent } from "./base-agent"

export interface OrchestrationResult {
  response: string
  activeAgents: string[]
  agentOutputs: Record<string, string>
}

export class AgentOrchestrator {
  private researchAgent: ResearchAgent
  private documentationAgent: DocumentationAgent
  private drugInteractionAgent: DrugInteractionAgent

  constructor() {
    this.researchAgent = new ResearchAgent()
    this.documentationAgent = new DocumentationAgent()
    this.drugInteractionAgent = new DrugInteractionAgent()
  }

  async processRequest(
    input: string,
    context?: any
  ): Promise<OrchestrationResult> {
    const activeAgents: string[] = []
    const agentOutputs: Record<string, string> = {}

    // Determine which agents should handle this request
    const agents = this.selectAgents(input)

    // Execute agents in parallel or sequence as needed
    for (const agent of agents) {
      try {
        const output = await agent.process(input, context)
        activeAgents.push(agent.getName())
        agentOutputs[agent.getName()] = output
      } catch (error) {
        console.error(`Error in ${agent.getName()}:`, error)
      }
    }

    // Synthesize responses
    const response = this.synthesizeResponses(agentOutputs, input)

    return {
      response,
      activeAgents,
      agentOutputs,
    }
  }

  private selectAgents(input: string): BaseAgent[] {
    const lowerInput = input.toLowerCase()
    const agents: BaseAgent[] = []

    // Research agent for medical information queries
    if (
      lowerInput.includes("what is") ||
      lowerInput.includes("research") ||
      lowerInput.includes("guidelines") ||
      lowerInput.includes("evidence") ||
      lowerInput.includes("treatment for") ||
      lowerInput.includes("diagnosis")
    ) {
      agents.push(this.researchAgent)
    }

    // Documentation agent for note generation
    if (
      lowerInput.includes("soap") ||
      lowerInput.includes("note") ||
      lowerInput.includes("document") ||
      lowerInput.includes("generate") ||
      lowerInput.includes("write up")
    ) {
      agents.push(this.documentationAgent)
    }

    // Drug interaction agent for medication queries
    if (
      lowerInput.includes("interaction") ||
      lowerInput.includes("drug") ||
      lowerInput.includes("medication") ||
      (lowerInput.includes("check") && lowerInput.includes("med"))
    ) {
      agents.push(this.drugInteractionAgent)
    }

    // If no specific agent matches, use research as default
    if (agents.length === 0) {
      agents.push(this.researchAgent)
    }

    return agents
  }

  private synthesizeResponses(
    outputs: Record<string, string>,
    input: string
  ): string {
    const agentNames = Object.keys(outputs)

    if (agentNames.length === 0) {
      return "I apologize, but I couldn't process your request. Please try rephrasing your question."
    }

    if (agentNames.length === 1) {
      return outputs[agentNames[0]]
    }

    // Multiple agents responded - combine their outputs
    let synthesized = "**Multi-Agent Analysis**\n\n"

    agentNames.forEach((agentName) => {
      synthesized += `### ${agentName}\n\n${outputs[agentName]}\n\n---\n\n`
    })

    return synthesized
  }

  getAvailableAgents(): string[] {
    return [
      this.researchAgent.getName(),
      this.documentationAgent.getName(),
      this.drugInteractionAgent.getName(),
    ]
  }
}
