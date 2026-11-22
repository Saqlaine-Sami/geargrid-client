"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const { token } = useAuth();

  const [status, setStatus] = useState("verifying");
  const [details, setDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    if (!token || !sessionId || !bookingId) return;

    apiFetch(
      "/api/payments/confirm",
      {
        method: "POST",
        body: JSON.stringify({ sessionId, bookingId }),
      },
      token
    )
      .then((data) => {
        if (!active) return;
        setDetails(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!active) return;
        setErrorMsg(err.message);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [token, sessionId, bookingId]);

  if (status === "verifying") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return (
      <div className="max-w-lg mx-auto my-16 px-4 text-center">
        <div className="bg-white border border-rose-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-rose-600 mb-2">
            Payment Verification Issue
          </h1>
          <p className="text-slate-600 mb-6">{errorMsg}</p>
          <Link href="/dashboard/my-rentals" className="btn-brand">
            Go to My Rentals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-16 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your rental booking has been confirmed and your transaction has been recorded.
        </p>

        {details?.booking && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Equipment:</span>
              <span className="font-semibold">{details.booking.equipmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rental Period:</span>
              <span className="font-semibold">
                {details.booking.startDate} → {details.booking.endDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-teal-700">
                ${details.booking.totalAmount}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono text-xs break-all">
                {details.payment?.transactionId}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <Link href="/dashboard/my-rentals" className="btn-brand">
            View My Rentals
          </Link>
          <Link href="/equipment" className="btn-brand-outline">
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PrivateRoute allowedRoles={["Customer"]}>
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentSuccessContent />
      </Suspense>
    </PrivateRoute>
  );
}
