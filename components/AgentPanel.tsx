import { Bot, Activity } from "lucide-react"

interface AgentPanelProps {
  activeAgents: string[]
}

export function AgentPanel({ activeAgents }: AgentPanelProps) {
  const allAgents = [
    {
      name: "Research Agent",
      description: "Medical literature & guidelines",
      icon: "🔬",
    },
    {
      name: "Documentation Agent",
      description: "Clinical note generation",
      icon: "📝",
    },
    {
      name: "Drug Interaction Agent",
      description: "Medication safety checks",
      icon: "💊",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
      </div>

      <div className="space-y-3">
        {allAgents.map((agent, index) => {
          const isActive = activeAgents.includes(agent.name)

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {agent.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-1">
                    <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Multi-Agent System:</strong> Specialized AI agents collaborate
          to provide comprehensive clinical support using MCP for data access.
        </p>
      </div>
    </div>
  )
}
