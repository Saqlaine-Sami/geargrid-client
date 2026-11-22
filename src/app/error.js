"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-600 max-w-md mb-6">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="btn-brand">
          Try Again
        </button>
        <Link href="/" className="btn-brand-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
