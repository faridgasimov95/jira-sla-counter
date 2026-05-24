import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../api/accountApi";
import FormField from "./FormField";

interface Props {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { user, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function handleDelete() {
    setError("");
    try {
      setIsLoading(true);
      await deleteAccount(password, user!.token);
      setSuccess("Account deleted successfully.");
      setTimeout(() => signOut(), 2000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-2xl border border-divider shadow-sm p-8 w-[24rem] flex flex-col gap-6 backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Delete Account</h2>
        <p className="text-sm text-text-muted">
          This action is permanent and cannot be undone. All your files and
          settings will be deleted.
        </p>
      </div>
      <FormField
        label="Confirm Password"
        name="confirm_password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-xs text-error">{error}</p>}
      {success && <p className="text-xs text-primary">{success}</p>}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={!!success}
          className="text-sm text-text-muted hover:text-text-base transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || !!success}
          className="text-sm text-error font-medium hover:opacity-75 transition-opacity"
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </dialog>
  );
}
