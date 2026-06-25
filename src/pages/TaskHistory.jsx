import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Receipt,
  Eye,
  ListChecks,
  Search,
  PlusCircle,
} from "lucide-react";
import Card from "../components/ui/Card.jsx";
import { StatusBadge, ConfidenceBar } from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { listTasks } from "../api/tasks.js";
import { useAuth } from "../auth/AuthContext.jsx";
import SignInPrompt from "../components/SignInPrompt.jsx";

export default function TaskHistory() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(!!user);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    listTasks()
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task history</h1>
          <p className="mt-1 text-sm text-gray-600">
            Every task you've submitted, newest first.
          </p>
        </div>
        <SignInPrompt
          title="Sign in to view your history"
          description="Task history is per-user. Sign in or create a free account to start tracking your tasks."
        />
      </div>
    );
  }

  const filtered = tasks.filter(
    (t) =>
      !query || (t.title || "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task history</h1>
          <p className="mt-1 text-sm text-gray-600">
            Every task you've submitted, newest first.
          </p>
        </div>
        <Link to="/tasks/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            New task
          </Button>
        </Link>
      </div>

      {!loading && tasks.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
            description={
              tasks.length === 0
                ? "Create your first task to see it appear here."
                : "Try a different search term."
            }
            action={
              tasks.length === 0 && (
                <Link to="/tasks/new">
                  <Button>
                    <PlusCircle className="h-4 w-4" />
                    Create task
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Created
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filtered.map((t) => {
                    const Icon =
                      t.taskType === "INVOICE_REVIEW" ? Receipt : FileText;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {t.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {t.taskType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="px-6 py-4">
                          {t.result ? (
                            <ConfidenceBar value={t.result.confidence} />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/tasks/${t.id}`}>
                            <Button variant="secondary">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-gray-200 md:hidden">
              {filtered.map((t) => {
                const Icon =
                  t.taskType === "INVOICE_REVIEW" ? Receipt : FileText;
                return (
                  <li key={t.id}>
                    <Link
                      to={`/tasks/${t.id}`}
                      className="block p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate font-medium text-gray-900">
                              {t.title}
                            </div>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {t.taskType}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            {t.result ? (
                              <ConfidenceBar value={t.result.confidence} />
                            ) : (
                              <span />
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(t.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}
