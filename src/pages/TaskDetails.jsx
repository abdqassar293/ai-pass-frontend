import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Receipt, Clock } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { StatusBadge, ConfidenceBar } from '../components/ui/Badge.jsx'
import { getTask } from '../api/tasks.js'
import toast from 'react-hot-toast'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTask(id)
      .then(setTask)
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.error('Task not found')
          navigate('/tasks')
        } else {
          toast.error('Could not load task')
        }
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
  }
  if (!task) return null

  const Icon = task.taskType === 'INVOICE_REVIEW' ? Receipt : FileText
  const result = task.result

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{task.taskType}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={task.status} />
        </div>
      </Card>

      {/* Result */}
      {result && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Result</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Decision</div>
              <div className="mt-2"><StatusBadge status={result.decision} /></div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Confidence</div>
              <div className="mt-2"><ConfidenceBar value={result.confidence} /></div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Timestamp</div>
              <div className="mt-2 text-sm font-medium text-gray-900">
                {result.timestamp ? new Date(result.timestamp).toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Explanation</div>
            <p className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800">
              {result.explanation || '—'}
            </p>
          </div>
        </Card>
      )}

      {/* Input */}
      <Card className="p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Input</h2>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
{task.inputText}
        </pre>
      </Card>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => navigate('/tasks/new')}>
          Create another task
        </Button>
      </div>
    </div>
  )
}
