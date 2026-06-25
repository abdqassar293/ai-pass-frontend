import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";

export default function SignInPrompt({
  title = "Sign in required",
  description,
}) {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
        <LogIn className="h-6 w-6 text-brand-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          {description}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/login">
          <Button>Sign in</Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary">Create account</Button>
        </Link>
      </div>
    </Card>
  );
}
