import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Receipt, Sparkles } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import { Input, TextArea } from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { createTask } from "../api/tasks.js";
import { useAuth } from "../auth/AuthContext.jsx";

const TASK_TYPES = [
  {
    value: "DOCUMENT_SUMMARY",
    label: "Document Summary",
    description: "Summarize text and extract key insights",
    icon: FileText,
  },
  {
    value: "INVOICE_REVIEW",
    label: "Invoice Review",
    description: "Validate required invoice fields",
    icon: Receipt,
  },
];

const SAMPLES = {
  DOCUMENT_SUMMARY:
    "AI orchestration platforms enable enterprises to automate complex workflows. They combine large language models with rule-based engines, integrations, and structured data. The result is faster decision-making with full traceability across every step.",
  INVOICE_REVIEW:
    "Invoice No: 4521\nDate: 2026-06-22\nVendor: Acme Corp\nTotal: $1,250.00\nDue: 2026-07-15",
};

export default function TaskCreate() {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("DOCUMENT_SUMMARY");
  const [inputText, setInputText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const task = await createTask({ title, taskType, inputText });
      toast.success("Task executed successfully");
      navigate(`/tasks/${task.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create task");
    } finally {
      setSubmitting(false);
    }
  };

  const loadSample = () => {
    setInputText(SAMPLES[taskType]);
    if (!title) {
      setTitle(
        taskType === "INVOICE_REVIEW"
          ? "Invoice #4521 review"
          : "Document summary",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create a task</h1>
        <p className="mt-1 text-sm text-gray-600">
          Submit input to the execution engine and get a structured result.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 invoice review"
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Task type
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TASK_TYPES.map((t) => {
                const Icon = t.icon;
                const selected = taskType === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setTaskType(t.value)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{t.label}</div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {t.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Task content
              </label>
              <button
                type="button"
                onClick={loadSample}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Load sample
              </button>
            </div>
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              placeholder="Paste the text to be processed..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            {user ? (
              <Button type="submit" disabled={submitting}>
                <Sparkles className="h-4 w-4" />
                {submitting ? "Running…" : "Run task"}
              </Button>
            ) : (
              <Link to="/login">
                <Button type="button">Sign in to run</Button>
              </Link>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
