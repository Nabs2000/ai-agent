/**
 * Documentation Agent
 * Generates clinical notes, SOAP notes, and medical documentation
 */

import { BaseAgent, AgentConfig } from "./base-agent"

export interface PatientContext {
  name?: string
  age?: number
  gender?: string
  chiefComplaint?: string
  conditions?: string[]
  medications?: string[]
  vitals?: Record<string, string>
}

export class DocumentationAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: "Documentation Agent",
      role: "Clinical Documentation Specialist",
      systemPrompt: `You are a clinical documentation AI agent specialized in creating accurate, professional medical notes. Your role is to:
- Generate SOAP notes (Subjective, Objective, Assessment, Plan)
- Create visit summaries and clinical documentation
- Ensure proper medical terminology and formatting
- Include all relevant clinical details
- Follow HIPAA-compliant documentation practices

Documentation Structure:
1. **Subjective:** Patient's chief complaint and history
2. **Objective:** Vitals, physical exam findings, lab results
3. **Assessment:** Clinical impression and diagnoses
4. **Plan:** Treatment plan, medications, follow-up

Always maintain professional medical documentation standards.`,
    }
    super(config)
  }

  async process(input: string, context?: PatientContext): Promise<string> {
    this.addToHistory({ role: "user", content: input })

    const response = await this.generateDocumentation(input, context)

    this.addToHistory({ role: "assistant", content: response })
    return response
  }

  private async generateDocumentation(
    input: string,
    context?: PatientContext
  ): Promise<string> {
    // Generate SOAP note based on context
    if (context && (context.chiefComplaint || context.conditions)) {
      return this.generateSOAPNote(context)
    }

    return `**Clinical Documentation**

I can help generate clinical documentation including:
- SOAP notes
- Visit summaries
- Treatment plans
- Progress notes

Please provide patient details such as:
- Chief complaint
- Vital signs
- Examination findings
- Current medications
- Assessment and plan

What type of documentation would you like me to create?`
  }

  private generateSOAPNote(context: PatientContext): string {
    const date = new Date().toLocaleDateString()

    return `**SOAP NOTE**
**Date:** ${date}
**Patient:** ${context.name || "[Patient Name]"}, ${context.age || "XX"}yo ${context.gender || "[Gender]"}

---

**SUBJECTIVE:**
Chief Complaint: ${context.chiefComplaint || "Follow-up visit"}

HPI: ${context.age || "XX"}-year-old ${context.gender || "patient"} presents for ${context.chiefComplaint?.toLowerCase() || "routine follow-up"}. ${context.conditions ? `Known medical history includes ${context.conditions.join(", ")}.` : ""}

Current Medications: ${context.medications ? context.medications.join(", ") : "See medication list"}

---

**OBJECTIVE:**
Vitals: ${context.vitals ? Object.entries(context.vitals).map(([key, value]) => `${key}: ${value}`).join(", ") : "BP: [xxx/xx], HR: [xx], Temp: [xx.x]°F, SpO2: [xx]%"}

Physical Exam: Alert and oriented. [Additional exam findings as documented]

---

**ASSESSMENT:**
${context.conditions ? context.conditions.map((condition, i) => `${i + 1}. ${condition} - stable/controlled`).join("\n") : "1. [Primary diagnosis]\n2. [Secondary diagnoses as applicable]"}

---

**PLAN:**
${context.conditions ? context.conditions.map((condition, i) => {
  if (condition.toLowerCase().includes("diabetes")) {
    return `${i + 1}. **Type 2 Diabetes:**
   - Continue current regimen
   - HbA1c monitoring every 3 months
   - Reinforce lifestyle modifications
   - Annual diabetic eye exam, foot exam`
  }
  if (condition.toLowerCase().includes("hypertension")) {
    return `${i + 1}. **Hypertension:**
   - Continue antihypertensive therapy
   - Home BP monitoring
   - Target BP < 130/80 mmHg
   - Follow-up in 3 months`
  }
  return `${i + 1}. **${condition}:**
   - Continue current management
   - Monitor for changes
   - Follow-up as scheduled`
}).join("\n\n") : `1. Continue current medications
2. Follow-up in [timeframe]
3. Patient education provided
4. [Additional interventions]`}

**Follow-up:** [X weeks/months]

---
*Note: This is a template. Please review and modify based on actual clinical encounter.*`
  }
}
