/**
 * Base Agent Class
 * Foundation for specialized medical AI agents
 */

export interface AgentMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AgentTool {
  name: string
  description: string
  execute: (params: any) => Promise<any>
}

export interface AgentConfig {
  name: string
  role: string
  systemPrompt: string
  tools?: AgentTool[]
}

export abstract class BaseAgent {
  protected name: string
  protected role: string
  protected systemPrompt: string
  protected tools: AgentTool[]
  protected conversationHistory: AgentMessage[]

  constructor(config: AgentConfig) {
    this.name = config.name
    this.role = config.role
    this.systemPrompt = config.systemPrompt
    this.tools = config.tools || []
    this.conversationHistory = []
  }

  getName(): string {
    return this.name
  }

  getRole(): string {
    return this.role
  }

  abstract process(input: string, context?: any): Promise<string>

  protected addToHistory(message: AgentMessage): void {
    this.conversationHistory.push(message)
  }

  protected getHistory(): AgentMessage[] {
    return this.conversationHistory
  }

  clearHistory(): void {
    this.conversationHistory = []
  }
}
