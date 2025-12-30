# MediSync AI - Architecture Documentation

## System Architecture Overview

MediSync AI is built on a modern, scalable architecture that showcases state-of-the-art AI concepts.

## Component Architecture

### 1. Frontend Layer (Next.js 14 + React)

```
┌─────────────────────────────────────────────┐
│           User Interface Layer              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │   Header     │  │  Patient Info    │    │
│  │              │  │     Card         │    │
│  └──────────────┘  └──────────────────┘    │
│                                             │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │    Agent     │  │      Chat        │    │
│  │    Panel     │  │   Interface      │    │
│  └──────────────┘  └──────────────────┘    │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │    Clinical Notes Panel              │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Components**:
- `Header.tsx`: Application branding and navigation
- `PatientInfoCard.tsx`: Displays demo patient context
- `AgentPanel.tsx`: Shows active AI agents with real-time status
- `ChatInterface.tsx`: Natural language interaction
- `ClinicalNotesPanel.tsx`: Displays and exports generated documentation

### 2. API Layer (Next.js API Routes)

```
┌─────────────────────────────────────────────┐
│         API Routes (/app/api)               │
├─────────────────────────────────────────────┤
│                                             │
│  POST /api/chat                             │
│  ├─ Receives user message                   │
│  ├─ Routes to Agent Orchestrator            │
│  ├─ Returns AI response + agent status      │
│  └─ Handles errors                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Route**: [`/app/api/chat/route.ts`](app/api/chat/route.ts)
- Accepts POST requests with user messages
- Integrates with agent orchestrator
- Provides patient context automatically
- Returns structured responses

### 3. Agent System (Core Intelligence)

```
┌────────────────────────────────────────────────────┐
│          Agent Orchestrator                        │
│  (Intelligent Request Routing)                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  Input: User Query + Patient Context               │
│                                                    │
│  Process:                                          │
│  1. Analyze user intent                            │
│  2. Select appropriate agent(s)                    │
│  3. Execute agents (parallel or sequential)        │
│  4. Synthesize responses                           │
│                                                    │
│  Output: Combined Response + Active Agents         │
│                                                    │
└────────────┬───────────────┬───────────────┬───────┘
             │               │               │
             ▼               ▼               ▼
    ┌────────────┐  ┌───────────────┐  ┌──────────────┐
    │ Research   │  │Documentation  │  │ Drug Inter-  │
    │   Agent    │  │    Agent      │  │action Agent  │
    └────────────┘  └───────────────┘  └──────────────┘
```

#### Base Agent Architecture

All agents inherit from `BaseAgent`:

```typescript
abstract class BaseAgent {
  - name: string
  - role: string
  - systemPrompt: string
  - tools: AgentTool[]
  - conversationHistory: AgentMessage[]

  + abstract process(input, context): Promise<string>
  + addToHistory(message): void
  + clearHistory(): void
}
```

#### Specialized Agents

**1. Research Agent** ([`research-agent.ts`](lib/agents/research-agent.ts))
- Role: Medical Literature Researcher
- Capabilities:
  - Search medical databases via MCP
  - Provide evidence-based recommendations
  - Cite clinical guidelines (ADA, ACC/AHA, etc.)
  - Explain medical concepts clearly

**2. Documentation Agent** ([`documentation-agent.ts`](lib/agents/documentation-agent.ts))
- Role: Clinical Documentation Specialist
- Capabilities:
  - Generate SOAP notes
  - Create visit summaries
  - Follow medical documentation standards
  - Use proper medical terminology

**3. Drug Interaction Agent** ([`drug-interaction-agent.ts`](lib/agents/drug-interaction-agent.ts))
- Role: Medication Safety Specialist
- Capabilities:
  - Check drug-drug interactions
  - Assess severity levels
  - Provide clinical recommendations
  - Suggest alternatives

### 4. Model Context Protocol (MCP) Server

```
┌──────────────────────────────────────────────┐
│         MCP Server (mcp-server/index.js)     │
├──────────────────────────────────────────────┤
│                                              │
│  Exposed Tools:                              │
│                                              │
│  1. search_condition                         │
│     Input: { query: string }                 │
│     Returns: Medical condition information   │
│                                              │
│  2. get_medication_info                      │
│     Input: { medication: string }            │
│     Returns: Drug details, dosing, warnings  │
│                                              │
│  3. check_drug_interactions                  │
│     Input: { medications: string[] }         │
│     Returns: Interaction analysis            │
│                                              │
│  4. interpret_lab_values                     │
│     Input: { test: string, value: string }   │
│     Returns: Clinical interpretation         │
│                                              │
└──────────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │ Medical Databases│
    │  (Simulated)     │
    └──────────────────┘
```

**MCP Benefits**:
- Standardized protocol for data access
- Easy to swap or add new data sources
- Type-safe tool definitions
- Built-in error handling
- Scalable architecture

## Data Flow

### Example: "Generate SOAP Note" Request

```
1. User Input
   └─> "Generate a SOAP note for today's visit"

2. Frontend (ChatInterface)
   └─> POST /api/chat
       Body: { message: "Generate..." }

3. API Route
   └─> AgentOrchestrator.processRequest(message, patientContext)

4. Agent Orchestrator
   ├─> Analyze: Intent = "documentation"
   └─> Select: DocumentationAgent

5. Documentation Agent
   ├─> Access patient context
   ├─> Generate SOAP structure
   └─> Return formatted note

6. API Response
   └─> {
         response: "**SOAP NOTE**...",
         activeAgents: ["Documentation Agent"],
         agentOutputs: {...}
       }

7. Frontend Update
   ├─> Display response in chat
   ├─> Highlight active agent (green)
   └─> Show note in Clinical Notes panel
```

### Example: "Check Drug Interactions" Request

```
1. User Input
   └─> "Check interactions between Lisinopril and Ibuprofen"

2. Frontend → API → Orchestrator

3. Agent Orchestrator
   ├─> Analyze: Intent = "drug interaction"
   └─> Select: DrugInteractionAgent

4. Drug Interaction Agent
   ├─> Extract medications: ["Lisinopril", "Ibuprofen"]
   ├─> Call MCP: check_drug_interactions()
   ├─> Receive interaction data from MCP server
   └─> Generate clinical recommendations

5. MCP Server
   ├─> Query medical database
   ├─> Find: Moderate interaction
   └─> Return: Severity, mechanism, recommendations

6. Response Flow
   └─> Agent → Orchestrator → API → Frontend
```

## Technology Stack Details

### Frontend Technologies

| Technology | Purpose | Why We Use It |
|-----------|---------|---------------|
| Next.js 14 | React framework | App Router, API routes, SSR |
| TypeScript | Type safety | Catch bugs at compile time |
| Tailwind CSS | Styling | Rapid UI development |
| Lucide Icons | Icons | Modern, consistent iconography |

### Backend Technologies

| Technology | Purpose | Why We Use It |
|-----------|---------|---------------|
| Next.js API Routes | Backend API | Serverless, integrated with frontend |
| Node.js | Runtime | JavaScript on server |
| MCP SDK | Protocol implementation | Standardized AI-data integration |

### Agent Technologies

| Technology | Purpose | Why We Use It |
|-----------|---------|---------------|
| Custom Agent Classes | AI orchestration | Specialized, maintainable agents |
| TypeScript Interfaces | Type definitions | Contract-based development |
| Context Management | State handling | Patient-aware responses |

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer                     │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼───┐
│ Next.js│      │Next.js │  (Multiple instances)
│ Server │      │Server  │
└───┬────┘      └────┬───┘
    │                │
    └────────┬───────┘
             │
    ┌────────▼────────┐
    │ Agent System    │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │   MCP Server    │
    └────────┬────────┘
             │
    ┌────────▼────────────────────┐
    │  Medical Databases          │
    │  - PubMed API              │
    │  - FDA Drug Database       │
    │  - Clinical Guidelines DB  │
    └─────────────────────────────┘
```

## Security Considerations

### Current Demo
- Simulated data only
- No authentication
- Local development only
- No data persistence

### Production Requirements
- [ ] HIPAA compliance
- [ ] End-to-end encryption
- [ ] User authentication (OAuth 2.0)
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Data anonymization
- [ ] Secure MCP connections
- [ ] Rate limiting
- [ ] Input validation and sanitization

## Scalability

### Horizontal Scaling
- Stateless API design allows multiple instances
- Agent orchestrator can distribute work
- MCP server can be clustered

### Vertical Scaling
- Agent processing can use more powerful AI models
- Database caching for MCP tools
- CDN for static assets

### Performance Optimizations
- React Server Components for faster loads
- Streaming responses for long agent tasks
- Parallel agent execution
- Memoization in UI components
- Lazy loading of components

## File Structure Map

```
medisync-ai/
├── app/
│   ├── api/chat/route.ts         → API endpoint
│   ├── layout.tsx                → Root layout
│   ├── page.tsx                  → Main page (orchestrates UI)
│   └── globals.css               → Global styles
│
├── components/
│   ├── Header.tsx                → Top navigation
│   ├── PatientInfoCard.tsx       → Patient context display
│   ├── AgentPanel.tsx            → Active agents visualization
│   ├── ChatInterface.tsx         → User interaction
│   └── ClinicalNotesPanel.tsx    → Documentation output
│
├── lib/
│   ├── agents/
│   │   ├── base-agent.ts         → Abstract base class
│   │   ├── research-agent.ts     → Medical research specialist
│   │   ├── documentation-agent.ts→ SOAP note generator
│   │   ├── drug-interaction-agent.ts → Medication safety
│   │   └── agent-orchestrator.ts → Multi-agent coordinator
│   └── utils.ts                  → Helper functions
│
├── mcp-server/
│   └── index.js                  → MCP protocol server
│
└── Documentation/
    ├── README.md                 → Main documentation
    ├── QUICKSTART.md             → Quick setup guide
    ├── DEMO_GUIDE.md             → Presentation guide
    └── ARCHITECTURE.md           → This file
```

## Agent Communication Protocol

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Natural Language
       ▼
┌─────────────────┐
│ Chat Interface  │
└──────┬──────────┘
       │ HTTP POST
       ▼
┌──────────────────┐
│   API Route      │
└──────┬───────────┘
       │ Function Call
       ▼
┌───────────────────────┐
│ Agent Orchestrator    │
│ - Intent Analysis     │
│ - Agent Selection     │
│ - Response Synthesis  │
└──────┬────────────────┘
       │
   ┌───┴───┐
   ▼       ▼
┌──────┐ ┌──────┐  (Parallel execution)
│Agent1│ │Agent2│
└───┬──┘ └───┬──┘
    │        │
    │   ┌────┴────┐
    │   │MCP Tools│
    │   └────┬────┘
    │        │
    └────┬───┘
         ▼
  Combined Response
```

## Future Architecture Enhancements

### Phase 1: Real AI Integration
- Connect to Anthropic Claude API
- Implement streaming responses
- Add conversation memory

### Phase 2: Production MCP
- Connect to real medical databases
- Implement caching layer
- Add rate limiting

### Phase 3: Scale
- Microservices architecture
- Message queue for agent tasks
- Distributed caching (Redis)
- Database for conversation history

### Phase 4: Enterprise
- Multi-tenancy support
- Advanced analytics
- A/B testing framework
- Compliance monitoring

## Development Workflow

```
1. Local Development
   npm run dev → http://localhost:3000

2. Build for Production
   npm run build

3. Start Production Server
   npm start

4. Run MCP Server Separately
   npm run mcp-server
```

## Testing Strategy (Future)

```
Unit Tests
├── Agent logic tests
├── Component tests
└── Utility function tests

Integration Tests
├── API route tests
├── Agent orchestration tests
└── MCP server tests

E2E Tests
├── User flow tests
├── Multi-agent scenarios
└── Error handling
```

---

**This architecture supports**:
- ✅ Modularity and maintainability
- ✅ Scalability
- ✅ Type safety
- ✅ Separation of concerns
- ✅ Easy testing and debugging
- ✅ Future extensibility
