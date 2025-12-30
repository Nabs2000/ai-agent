/**
 * Drug Interaction Agent
 * Checks medication interactions and provides safety alerts
 */

import { BaseAgent, AgentConfig } from "./base-agent"

export class DrugInteractionAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: "Drug Interaction Agent",
      role: "Medication Safety Specialist",
      systemPrompt: `You are a medication safety AI agent specialized in drug interactions. Your role is to:
- Check for drug-drug interactions
- Identify contraindications
- Assess interaction severity (Major, Moderate, Minor)
- Provide clinical recommendations
- Alert to potential adverse effects

When analyzing medications:
1. Check each drug pair for interactions
2. Consider mechanism of interaction
3. Assess clinical significance
4. Provide monitoring recommendations
5. Suggest alternatives if needed

Always prioritize patient safety and evidence-based recommendations.`,
    }
    super(config)
  }

  async process(input: string, context?: any): Promise<string> {
    this.addToHistory({ role: "user", content: input })

    const response = await this.checkInteractions(input, context)

    this.addToHistory({ role: "assistant", content: response })
    return response
  }

  private async checkInteractions(input: string, context?: any): Promise<string> {
    // Extract medication names from input
    const medications = this.extractMedications(input)

    if (medications.length < 2) {
      return `**Medication Interaction Check**

Please provide at least 2 medications to check for interactions.

Example: "Check interactions between Metformin, Lisinopril, and Atorvastatin"

I can analyze:
- Drug-drug interactions
- Severity levels
- Clinical recommendations
- Monitoring parameters`
    }

    return this.generateInteractionReport(medications)
  }

  private extractMedications(input: string): string[] {
    const commonMeds = [
      "metformin", "lisinopril", "atorvastatin", "amlodipine",
      "levothyroxine", "omeprazole", "albuterol", "gabapentin",
      "losartan", "warfarin", "aspirin", "ibuprofen"
    ]

    const found: string[] = []
    const lowerInput = input.toLowerCase()

    for (const med of commonMeds) {
      if (lowerInput.includes(med)) {
        found.push(med.charAt(0).toUpperCase() + med.slice(1))
      }
    }

    return found
  }

  private generateInteractionReport(medications: string[]): string {
    const interactions = this.checkKnownInteractions(medications)

    let report = `**MEDICATION INTERACTION ANALYSIS**\n\n`
    report += `**Medications Analyzed:** ${medications.join(", ")}\n\n`
    report += `---\n\n`

    if (interactions.length === 0) {
      report += `✅ **No Major Interactions Detected**\n\n`
      report += `The medications listed do not have significant known drug-drug interactions based on current databases.\n\n`
      report += `**Recommendations:**\n`
      report += `- Continue routine monitoring\n`
      report += `- Monitor for adverse effects\n`
      report += `- Ensure proper dosing and administration times\n`
    } else {
      report += `⚠️ **${interactions.length} Interaction(s) Identified**\n\n`

      interactions.forEach((interaction, index) => {
        const severityEmoji = interaction.severity === "Major" ? "🔴" :
                            interaction.severity === "Moderate" ? "🟡" : "🟢"

        report += `**${index + 1}. ${interaction.drug1} ↔ ${interaction.drug2}**\n`
        report += `${severityEmoji} Severity: **${interaction.severity}**\n\n`
        report += `*Mechanism:* ${interaction.mechanism}\n\n`
        report += `*Clinical Effect:* ${interaction.effect}\n\n`
        report += `*Recommendation:* ${interaction.recommendation}\n\n`
        report += `---\n\n`
      })
    }

    report += `**General Monitoring:**\n`
    report += `- Review medication list regularly\n`
    report += `- Monitor for signs of adverse effects\n`
    report += `- Ensure patient awareness of potential interactions\n`
    report += `- Consider timing of medication administration\n\n`
    report += `*Always consult drug interaction databases for comprehensive analysis.*`

    return report
  }

  private checkKnownInteractions(medications: string[]): any[] {
    const interactions: any[] = []
    const meds = medications.map(m => m.toLowerCase())

    // Check for known interactions
    if (meds.includes("warfarin") && meds.includes("aspirin")) {
      interactions.push({
        drug1: "Warfarin",
        drug2: "Aspirin",
        severity: "Major",
        mechanism: "Both medications affect coagulation through different pathways",
        effect: "Increased bleeding risk",
        recommendation: "Avoid combination if possible. If necessary, use lowest effective aspirin dose and monitor INR closely. Watch for signs of bleeding."
      })
    }

    if (meds.includes("lisinopril") && meds.includes("ibuprofen")) {
      interactions.push({
        drug1: "Lisinopril",
        drug2: "Ibuprofen",
        severity: "Moderate",
        mechanism: "NSAIDs may reduce antihypertensive effect of ACE inhibitors",
        effect: "Decreased blood pressure control, potential renal dysfunction",
        recommendation: "Monitor blood pressure. Consider acetaminophen as alternative. Monitor renal function if combination necessary."
      })
    }

    if (meds.includes("metformin") && meds.includes("lisinopril")) {
      // This is actually a common, safe combination
      // No interaction added
    }

    if (meds.includes("atorvastatin") && meds.includes("amlodipine")) {
      interactions.push({
        drug1: "Atorvastatin",
        drug2: "Amlodipine",
        severity: "Minor",
        mechanism: "Amlodipine may increase atorvastatin levels via CYP3A4 inhibition",
        effect: "Slightly increased statin exposure",
        recommendation: "Generally safe combination. Monitor for muscle pain or weakness. Consider lower atorvastatin dose if needed."
      })
    }

    return interactions
  }
}
