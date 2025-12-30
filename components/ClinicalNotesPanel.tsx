import { FileText, Download } from "lucide-react"

interface ClinicalNotesPanelProps {
  notes: string
}

export function ClinicalNotesPanel({ notes }: ClinicalNotesPanelProps) {
  const handleDownload = () => {
    const blob = new Blob([notes], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clinical-note-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Clinical Notes
          </h2>
        </div>
        {notes && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes ? (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg">
              {notes}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No clinical notes generated yet
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Ask the assistant to generate a SOAP note
              </p>
            </div>
          </div>
        )}
      </div>

      {notes && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> AI-generated notes should be reviewed and
            validated by licensed healthcare professionals before use in patient
            care.
          </p>
        </div>
      )}
    </div>
  )
}
