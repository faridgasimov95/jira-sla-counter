import { useNavigate } from "react-router-dom";
import { submitButtonClass } from "../constants/styles";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background items-center justify-center">
      <div className="bg-surface border border-divider p-8 rounded-2xl shadow-sm flex flex-col gap-4 items-center text-center">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="text-sm text-text-muted">This page doesn't exist.</p>
        <button onClick={() => navigate("/")} className={submitButtonClass}>
          Go Home
        </button>
      </div>
    </div>
  );
}
