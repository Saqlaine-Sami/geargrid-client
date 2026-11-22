"use client";

export default function LoadingSpinner({ fullScreen = true }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-[70vh]" : "py-12"
      }`}
    >
      <span className="loading loading-spinner loading-lg text-teal-700" />
      <p className="text-sm font-medium text-slate-500">Loading GearGrid...</p>
    </div>
  );
}
