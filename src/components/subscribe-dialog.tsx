"use client";

import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { BellRing, Check, X } from "lucide-react";

const alertTypes = [
  "High Fire Activity",
  "Unusual Fire Activity",
  "High FRP",
  "Historical Risk Changes",
] as const;

export default function SubscribeDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  function openDialog() {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dialogRef.current?.close();
    setShowSuccessToast(true);
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-orange/30 bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-orange-deep shadow-sm transition-colors hover:border-orange/50 hover:bg-orange-soft/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <BellRing aria-hidden="true" className="size-3.5" />
        Subscribe
      </button>

      {showSuccessToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-20 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-md border border-emerald-200 bg-white p-4 text-ink shadow-lg sm:right-6"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <Check aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Subscription submitted</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Demo only — alert delivery is not connected yet.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessToast(false)}
            aria-label="Dismiss notification"
            className="grid size-7 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-surface-low hover:text-ink focus-visible:outline-2 focus-visible:outline-orange"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="subscribe-title"
        aria-describedby="subscribe-description"
        onClick={closeOnBackdrop}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg border border-line bg-white p-0 text-ink shadow-xl backdrop:bg-ink/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line/60 px-5 py-4 sm:px-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-deep">Fire alerts</span>
            <h2 id="subscribe-title" className="mt-1 text-xl font-semibold">Subscribe to updates</h2>
            <p id="subscribe-description" className="mt-1 text-sm leading-5 text-ink-muted">
              Choose the area and activity you want to monitor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close subscription form"
            className="grid size-8 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-surface-low hover:text-ink focus-visible:outline-2 focus-visible:outline-orange"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 px-5 py-5 sm:px-6">
          <label className="grid gap-1.5 text-sm font-medium">
            Email address
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="h-10 w-full rounded-sm border border-line bg-white px-3 text-sm font-normal text-ink outline-none placeholder:text-ink-muted/70 focus-visible:ring-2 focus-visible:ring-orange/40"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Area of Interest (AOI)
            <select
              name="areaOfInterest"
              required
              defaultValue=""
              className="h-10 w-full rounded-sm border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-orange/40"
            >
              <option value="" disabled>Select an area</option>
              <option value="California, USA">California, USA</option>
              <option value="Argentina">Argentina</option>
            </select>
          </label>

          <fieldset className="grid gap-2">
            <legend className="mb-1 text-sm font-medium">Alert types</legend>
            {alertTypes.map((alertType) => (
              <label key={alertType} className="flex items-center gap-2.5 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  name="alertTypes"
                  value={alertType}
                  className="size-4 accent-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                />
                {alertType}
              </label>
            ))}
          </fieldset>

          <fieldset className="grid gap-2">
            <legend className="mb-1 text-sm font-medium">Notification frequency</legend>
            <label className="flex items-center gap-2.5 text-sm text-ink-muted">
              <input
                type="radio"
                name="frequency"
                value="immediate"
                defaultChecked
                className="size-4 accent-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              />
              Immediate
            </label>
            <label className="flex items-center gap-2.5 text-sm text-ink-muted">
              <input
                type="radio"
                name="frequency"
                value="daily-summary"
                className="size-4 accent-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              />
              Daily Summary
            </label>
          </fieldset>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-orange px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            Subscribe
            <BellRing aria-hidden="true" className="size-4" />
          </button>
        </form>
      </dialog>
    </>
  );
}
