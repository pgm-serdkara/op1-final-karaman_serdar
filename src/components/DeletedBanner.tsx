"use client";
import { useEffect, useState } from "react";

interface DeletedBannerProps {
  initialShow: boolean;
  timeoutMs?: number;
}

export default function DeletedBanner({ initialShow, timeoutMs = 5000 }: DeletedBannerProps) {
  const [visible, setVisible] = useState(initialShow);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setVisible(false), timeoutMs);
    return () => clearTimeout(id);
  }, [visible, timeoutMs]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="my-4 p-3 border rounded bg-green-50 text-green-800 flex items-start justify-between gap-4"
    >
      <span>Boek is verwijderd.</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Sluit melding"
        className="text-green-900/70 hover:text-green-900 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
}
