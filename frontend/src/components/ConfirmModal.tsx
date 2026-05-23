import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  onConfirm: (id: number) => void;
  onClose: () => void;
  id: number;
}

export default function ConfirmModal({
  onConfirm,
  onClose,
  id,
}: ConfirmModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-2xl border border-divider shadow-sm p-8 w-[24rem] flex flex-col gap-4 backdrop:bg-black/40"
    >
      <h2 className="text-base font-semibold">Delete file</h2>
      <p className="text-sm text-text-muted">
        Are you sure you want tot delete the file?
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="text-sm text-text-muted hover:text-text-base transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(id);
            onClose();
          }}
          className="text-sm text-error font-medium hover:opacity-75 transition-opacity"
        >
          Delete
        </button>
      </div>
    </dialog>
  );
}
