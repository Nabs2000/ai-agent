/**
 * MCP Server for Medical Data Integration
 * Provides tools for accessing medical databases, drug information, and research papers
 */

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

// Mock medical databases (in production, these would connect to real APIs)
const MEDICAL_DATABASE = {
  conditions: [
    {
      id: "T2D",
      name: "Type 2 Diabetes",
      description: "Chronic condition affecting blood sugar regulation",
      symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
      commonTreatments: ["Metformin", "Lifestyle modifications", "Insulin therapy"],
      guidelines: "ADA 2024 Guidelines recommend HbA1c < 7% for most adults"
    },
    {
      id: "HTN",
      name: "Hypertension",
      description: "Persistently elevated blood pressure",
      symptoms: ["Often asymptomatic", "Headaches", "Dizziness"],
      commonTreatments: ["ACE inhibitors", "Beta-blockers", "Lifestyle changes"],
      guidelines: "ACC/AHA: Target BP < 130/80 mmHg for most patients"
    },
    {
      id: "ASTHMA",
      name: "Asthma",
      description: "Chronic inflammatory airway disease",
      symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing"],
      commonTreatments: ["Inhaled corticosteroids", "Bronchodilators", "Leukotriene modifiers"],
      guidelines: "GINA 2024: Step-wise approach based on symptom control"
    }
  ],

  medications: [
    {
      name: "Metformin",
      class: "Biguanide",
      indications: ["Type 2 Diabetes"],
      dosage: "500-2000mg daily in divided doses",
      sideEffects: ["GI upset", "Lactic acidosis (rare)", "B12 deficiency"],
      contraindications: ["Severe renal impairment (eGFR < 30)", "Acute metabolic acidosis"],
      interactions: ["Contrast dye", "Alcohol"]
    },
    {
      name: "Lisinopril",
      class: "ACE Inhibitor",
      indications: ["Hypertension", "Heart failure", "Post-MI"],
      dosage: "10-40mg once daily",
      sideEffects: ["Dry cough", "Hyperkalemia", "Angioedema (rare)"],
      contraindications: ["Pregnancy", "Bilateral renal artery stenosis", "Angioedema history"],
      interactions: ["NSAIDs", "Potassium supplements", "Diuretics"]
    },
    {
      name: "Albuterol",
      class: "Short-acting beta-2 agonist",
      indications: ["Asthma", "COPD"],
      dosage: "2 puffs every 4-6 hours as needed",
      sideEffects: ["Tremor", "Tachycardia", "Headache"],
      contraindications: ["Hypersensitivity to albuterol"],
      interactions: ["Beta-blockers", "MAO inhibitors"]
    },
    {
      name: "Atorvastatin",
      class: "Statin",
      indications: ["Hyperlipidemia", "CVD prevention"],
      dosage: "10-80mg once daily",
      sideEffects: ["Myalgia", "Elevated liver enzymes", "Rhabdomyolysis (rare)"],
      contraindications: ["Active liver disease", "Pregnancy"],
      interactions: ["Gemfibrozil", "Cyclosporine", "Grapefruit juice"]
    }
  ],

  labs: {
    "HbA1c": {
      normal: "< 5.7%",
      prediabetes: "5.7-6.4%",
      diabetes: ">= 6.5%",
      target: "< 7% for most diabetics"
    },
    "Blood Pressure": {
      normal: "< 120/80 mmHg",
      elevated: "120-129/<80 mmHg",
      stage1HTN: "130-139/80-89 mmHg",
      stage2HTN: ">= 140/90 mmHg"
    },
    "LDL Cholesterol": {
      optimal: "< 100 mg/dL",
      nearOptimal: "100-129 mg/dL",
      borderlineHigh: "130-159 mg/dL",
      high: ">= 160 mg/dL"
    }
  }
};

// Create MCP server instance
const server = new Server(
  {
    name: "medisync-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: Search medical conditions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_condition",
        description: "Search for medical condition information including symptoms, treatments, and guidelines",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Condition name or symptom to search for",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_medication_info",
        description: "Get detailed information about a medication including dosing, side effects, and interactions",
        inputSchema: {
          type: "object",
          properties: {
            medication: {
              type: "string",
              description: "Medication name",
            },
          },
          required: ["medication"],
        },
      },
      {
        name: "check_drug_interactions",
        description: "Check for interactions between multiple medications",
        inputSchema: {
          type: "object",
          properties: {
            medications: {
              type: "array",
              items: { type: "string" },
              description: "List of medication names to check",
            },
          },
          required: ["medications"],
        },
      },
      {
        name: "interpret_lab_values",
        description: "Interpret laboratory values and provide clinical context",
        inputSchema: {
          type: "object",
          properties: {
            test: {
              type: "string",
              description: "Lab test name",
            },
            value: {
              type: "string",
              description: "Lab value",
            },
          },
          required: ["test", "value"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "search_condition": {
      const query = args.query.toLowerCase();
      const results = MEDICAL_DATABASE.conditions.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.symptoms.some((s) => s.toLowerCase().includes(query))
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case "get_medication_info": {
      const medName = args.medication.toLowerCase();
      const medication = MEDICAL_DATABASE.medications.find(
        (m) => m.name.toLowerCase() === medName
      );

      if (!medication) {
        return {
          content: [
            {
              type: "text",
              text: `Medication "${args.medication}" not found in database`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(medication, null, 2),
          },
        ],
      };
    }

    case "check_drug_interactions": {
      const meds = args.medications.map((m) => m.toLowerCase());
      const foundMeds = MEDICAL_DATABASE.medications.filter((m) =>
        meds.includes(m.name.toLowerCase())
      );

      const interactions = [];
      for (let i = 0; i < foundMeds.length; i++) {
        for (let j = i + 1; j < foundMeds.length; j++) {
          const med1 = foundMeds[i];
          const med2 = foundMeds[j];

          // Check if either medication lists the other in interactions
          if (
            med1.interactions.some((int) =>
              med2.class.toLowerCase().includes(int.toLowerCase())
            ) ||
            med2.interactions.some((int) =>
              med1.class.toLowerCase().includes(int.toLowerCase())
            )
          ) {
            interactions.push({
              drug1: med1.name,
              drug2: med2.name,
              severity: "Moderate",
              description: `Potential interaction between ${med1.class} and ${med2.class}`,
            });
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                medications: foundMeds.map((m) => m.name),
                interactions:
                  interactions.length > 0
                    ? interactions
                    : "No significant interactions found",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "interpret_lab_values": {
      const test = args.test;
      const value = args.value;
      const labInfo = MEDICAL_DATABASE.labs[test];

      if (!labInfo) {
        return {
          content: [
            {
              type: "text",
              text: `Lab test "${test}" not found in database`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                test,
                value,
                referenceRanges: labInfo,
                interpretation: `Patient value: ${value}. Reference ranges provided above.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MediSync MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
