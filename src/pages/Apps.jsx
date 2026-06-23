import { Receipt, Users, Truck, BarChart3, ArrowRight, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card.jsx'

const APPS = [
  {
    name: 'Invoice AI',
    description: 'Automated invoice extraction, validation, and approval workflows.',
    icon: Receipt,
    color: 'from-emerald-500 to-emerald-600',
    tag: 'Finance'
  },
  {
    name: 'HR AI',
    description: 'CV screening, candidate matching, and intelligent onboarding.',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    tag: 'People'
  },
  {
    name: 'Supply Chain AI',
    description: 'Forecast demand, optimize logistics, and detect anomalies.',
    icon: Truck,
    color: 'from-amber-500 to-orange-500',
    tag: 'Operations'
  },
  {
    name: 'Analysis Studio',
    description: 'Build custom AI workflows for research and insight generation.',
    icon: BarChart3,
    color: 'from-purple-500 to-fuchsia-600',
    tag: 'Insights'
  }
]

export default function Apps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI-Pass Apps</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pre-built AI modules powered by the AI-Pass orchestration engine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {APPS.map(app => {
          const Icon = app.icon
          return (
            <Card key={app.name} className="group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${app.color} text-white shadow-md`}>
                <Icon className="h-6 w-6" />
              </div>

              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
                <Sparkles className="h-2.5 w-2.5" />
                Soon
              </span>

              <h3 className="text-base font-semibold text-gray-900">{app.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{app.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{app.tag}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-400">
                  Coming soon
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Want a custom module?</h3>
            <p className="text-sm text-gray-600">Use the AI-Pass APIs to build your own AI app on top of our orchestration engine.</p>
          </div>
          <a
            href="https://ai-pass-backend-7zli.onrender.com/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Open API docs
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </Card>
    </div>
  )
}
