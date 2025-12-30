import { User, Calendar, Activity } from "lucide-react"

export function PatientInfoCard() {
  // Demo patient data
  const patient = {
    name: "Sarah Johnson",
    age: 58,
    gender: "Female",
    mrn: "MRN-2024-1234",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    medications: ["Metformin 1000mg BID", "Lisinopril 20mg daily"],
    lastVisit: "2024-02-15",
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {patient.name}
          </h2>
          <p className="text-sm text-gray-500">{patient.mrn}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">
            {patient.age}yo {patient.gender}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Active Conditions
          </h3>
          <div className="space-y-1">
            {patient.conditions.map((condition, index) => (
              <div
                key={index}
                className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded"
              >
                {condition}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </h3>
          <div className="space-y-1">
            {patient.medications.map((med, index) => (
              <div
                key={index}
                className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded"
              >
                {med}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Activity className="h-3 w-3 mr-1" />
            Last visit: {patient.lastVisit}
          </div>
        </div>
      </div>
    </div>
  )
}
