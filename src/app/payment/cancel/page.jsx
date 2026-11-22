"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { token } = useAuth();

  useEffect(() => {
    if (token && bookingId) {
      apiFetch(
        `/api/bookings/${bookingId}/cancel-unpaid`,
        { method: "DELETE" },
        token
      ).catch(() => {});
    }
  }, [token, bookingId]);

  return (
    <div className="max-w-lg mx-auto my-16 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your payment was cancelled and no charge was made. You can try booking again anytime.
        </p>
        <Link href="/equipment" className="btn-brand">
          Back to Equipment
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
