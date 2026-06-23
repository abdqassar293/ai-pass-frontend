import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Bot,
  AppWindow,
  Sparkles
} from 'lucide-react'

const items = [
  { to: '/',         label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/tasks/new', label: 'New Task',  icon: PlusCircle },
  { to: '/tasks',    label: 'Task History', icon: ListChecks },
  { to: '/agents',   label: 'AI Agents',  icon: Bot },
  { to: '/apps',     label: 'AI-Pass Apps', icon: AppWindow }
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">AI-Pass</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Orchestration</div>
          </div>
        </div>

        <nav className="p-3">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
