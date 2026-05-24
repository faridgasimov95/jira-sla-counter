import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FormField from "./FormField";
import { submitButtonClass } from "../constants/styles";
import { changePassword } from "../api/accountApi";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePasswordModal({ onClose, onSuccess }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { user, signIn } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function handleSubmit() {
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const { token } = await changePassword(
        form.currentPassword,
        form.newPassword,
        user!.token
      );
      signIn(user!.email, token);
      onSuccess();
      onClose();
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
      <h2 className="text-base font-semibold">Change Password</h2>
      <div className="flex flex-col gap-4">
        <FormField
          label="Current Password"
          name="current_password"
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, currentPassword: e.target.value }))
          }
        />
        <FormField
          label="New Password"
          name="new_password"
          type="password"
          value={form.newPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, newPassword: e.target.value }))
          }
        />
        <FormField
          label="Confirm New Password"
          name="confirm_new_password"
          type="password"
          value={form.confirmNewPassword}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              confirmNewPassword: e.target.value,
            }))
          }
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="text-sm text-text-muted hover:text-text-base transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={submitButtonClass}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </dialog>
  );
}
