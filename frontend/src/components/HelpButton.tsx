import { useState } from "react";
import HelpModal from "./HelpModal";

export default function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary-hover transition-colors flex items-center justify-center"
      >
        ?
      </button>
      {open && <HelpModal onClose={() => setOpen(false)} />}
    </>
  );
}
