import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Bot, Play, ChevronDown } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import { TextArea } from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { ConfidenceBar } from '../components/ui/Badge.jsx'
import { listAgents, runAgent } from '../api/agents.js'

const AGENT_BLURBS = {
  DocumentAnalyst: 'Analyzes document structure and produces a readability report.',
  InvoiceAuditor: 'Audits invoices for required fields and flags missing data.'
}

const SAMPLES = {
  DocumentAnalyst:
    'AI orchestration platforms are reshaping enterprise workflows. They combine large language models with rule engines and integrations. The future of work is increasingly automated.',
  InvoiceAuditor:
    'Invoice No: 4521 | Date: 2026-06-22 | Total: $1,250.00 | Vendor: Acme Corp'
}

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [selected, setSelected] = useState('')
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    listAgents()
      .then(list => {
        setAgents(list)
        if (list.length > 0) setSelected(list[0])
      })
      .catch(() => toast.error('Could not load agents'))
      .finally(() => setLoadingAgents(false))
  }, [])

  const onRun = async (e) => {
    e.preventDefault()
    setRunning(true)
    setResult(null)
    try {
      const data = await runAgent(selected, input)
      setResult(data)
      toast.success(`${data.agent} ran successfully`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Agent execution failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Agents</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pick an agent, give it some input, and run it instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agent list */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Available agents</h2>
          {loadingAgents ? (
            <Card className="p-4 text-sm text-gray-500">Loading…</Card>
          ) : agents.length === 0 ? (
            <Card className="p-4 text-sm text-gray-500">No agents registered</Card>
          ) : (
            agents.map(name => {
              const isSelected = name === selected
              return (
                <button
                  key={name}
                  onClick={() => setSelected(name)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{AGENT_BLURBS[name] || 'AI agent'}</div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Run form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={onRun} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Selected agent</label>
                <div className="relative">
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    disabled={agents.length === 0}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    {agents.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Input</label>
                  {SAMPLES[selected] && (
                    <button
                      type="button"
                      onClick={() => setInput(SAMPLES[selected])}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      Load sample
                    </button>
                  )}
                </div>
                <TextArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={8}
                  placeholder="Provide the input the agent should process..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={running || !selected || !input.trim()}>
                  <Play className="h-4 w-4" />
                  {running ? 'Running…' : 'Run agent'}
                </Button>
              </div>
            </form>
          </Card>

          {result && (
            <Card className="mt-6 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Result</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Agent</div>
                    <div className="mt-1 font-semibold text-gray-900">{result.agent}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Confidence</div>
                    <div className="mt-2"><ConfidenceBar value={result.confidence} /></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Response</div>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800">
                    {result.result}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
