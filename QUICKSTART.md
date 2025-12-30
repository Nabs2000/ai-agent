# Quick Start Guide - MediSync AI

Get up and running in 5 minutes!

## Prerequisites

- Node.js v18+ installed ([Download here](https://nodejs.org))
- A terminal/command prompt

## Installation

```bash
# 1. Navigate to the project directory
cd ai-agent

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

## Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Try These Demo Commands

Once the app loads, try these in the chat interface:

### 1. Medical Research
```
What is the current treatment guideline for Type 2 Diabetes?
```

### 2. Drug Interaction Check
```
Check interactions between Lisinopril and Ibuprofen
```

### 3. Generate Clinical Documentation
```
Generate a SOAP note for today's visit
```

### 4. Multi-Agent Query
```
Research hypertension treatment and check for drug interactions with current medications
```

## What You'll See

- **Left Panel**: Demo patient information and active AI agents
- **Center Panel**: Chat interface for natural language queries
- **Right Panel**: Generated clinical notes (appears when you create a SOAP note)

## Watch the Agents Work

- Look at the "AI Agents" panel (left side, bottom)
- Agents will light up in green when they're actively working on your query
- You'll see which specialized agents are handling your request

## Export Your Notes

After generating a SOAP note:
1. Look at the Clinical Notes panel on the right
2. Click the "Export" button to download the note as a text file

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```
Then visit `http://localhost:3001`

### Dependencies Won't Install
Try:
```bash
npm cache clean --force
npm install
```

### Still Having Issues?
Check the [README.md](./README.md) for detailed setup instructions.

## Next Steps

- Read [README.md](./README.md) for architecture details
- Check [DEMO_GUIDE.md](./DEMO_GUIDE.md) for presentation tips
- Explore the code in `/lib/agents/` to see how agents work
- Look at `/mcp-server/index.js` to understand MCP integration

## What Makes This Special?

1. **Multi-Agent Architecture**: Three specialized AI agents (Research, Documentation, Drug Interaction)
2. **MCP Integration**: Standardized protocol for accessing medical databases
3. **Real-Time Collaboration**: Watch multiple agents work together
4. **Production-Ready UI**: Built with Next.js 14, TypeScript, and Tailwind CSS

## Demo Mode

This application runs in demo mode with simulated responses. No API key is required to try it out. For production use with real AI responses, you would:

1. Get an Anthropic API key
2. Add it to `.env` file
3. Integrate the agents with Claude API

---

**Enjoy exploring MediSync AI!**

Built to showcase SOTA AI concepts: Multi-agent systems, MCP, and modern healthtech solutions.
