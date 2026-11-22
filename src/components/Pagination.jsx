"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-200">
      <p className="text-sm text-slate-600">
        Showing page <span className="font-semibold text-slate-900">{page}</span>{" "}
        of <span className="font-semibold text-slate-900">{totalPages}</span>
        {typeof total === "number" && (
          <span> ({total} total item{total === 1 ? "" : "s"})</span>
        )}
      </p>

      <div className="join">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="join-item btn btn-sm btn-outline border-slate-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`join-item btn btn-sm ${
              p === page
                ? "bg-teal-700 text-white border-teal-700 hover:bg-teal-800"
                : "btn-outline border-slate-300"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="join-item btn btn-sm btn-outline border-slate-300"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
