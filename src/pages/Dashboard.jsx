import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ListChecks,
  PlusCircle,
  Bot,
  AppWindow,
  ArrowRight,
  FileText,
  Receipt,
  Sparkles,
} from "lucide-react";
import Card from "../components/ui/Card.jsx";
import { StatusBadge } from "../components/ui/Badge.jsx";
import { listTasks } from "../api/tasks.js";
import { useAuth } from "../auth/AuthContext.jsx";

function StatCard({ icon: Icon, label, value, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">
            {value}
          </div>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    listTasks()
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [user]);

  const total = tasks.length;
  const completed = tasks.filter(
    (t) => (t.status || "").toUpperCase() === "COMPLETED",
  ).length;
  const failed = tasks.filter(
    (t) => (t.status || "").toUpperCase() === "FAILED",
  ).length;
  const recent = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-center gap-2 text-brand-200">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Pass Workspace</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          {user
            ? `Welcome back, ${user.email.split("@")[0]} 👋`
            : "Welcome to AI-Pass 👋"}
        </h1>
        <p className="mt-2 max-w-2xl text-brand-100">
          {user
            ? "Create AI tasks, orchestrate agents, and review execution history — all from one place."
            : "Explore the orchestration platform. Sign in to create tasks and run agents."}
        </p>
        <p className="mt-2 max-w-2xl text-brand-100">
          Create AI tasks, orchestrate agents, and review execution history —
          all from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={ListChecks}
          label="Total tasks"
          value={loading ? "—" : total}
          accent="brand"
        />
        <StatCard
          icon={Sparkles}
          label="Completed"
          value={loading ? "—" : completed}
          accent="emerald"
        />
        <StatCard
          icon={Bot}
          label="Failed"
          value={loading ? "—" : failed}
          accent="amber"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            to="/tasks/new"
            icon={PlusCircle}
            title="New task"
            description="Run summary or invoice review"
          />
          <QuickAction
            to="/tasks"
            icon={ListChecks}
            title="Task history"
            description="View past executions"
          />
          <QuickAction
            to="/agents"
            icon={Bot}
            title="Run an agent"
            description="DocumentAnalyst, InvoiceAuditor"
          />
          <QuickAction
            to="/apps"
            icon={AppWindow}
            title="AI-Pass apps"
            description="Browse modules"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent activity
          </h2>
          {tasks.length > 0 && (
            <Link
              to="/tasks"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          )}
        </div>

        <Card>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading…
            </div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No tasks yet.</p>
              <Link
                to="/tasks/new"
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Create your first task →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recent.map((t) => {
                const Icon =
                  t.taskType === "INVOICE_REVIEW" ? Receipt : FileText;
                return (
                  <li key={t.id}>
                    <Link
                      to={`/tasks/${t.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-gray-900">
                          {t.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t.taskType} ·{" "}
                          {new Date(t.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <StatusBadge status={t.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
