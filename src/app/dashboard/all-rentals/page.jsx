"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function AdminAllRentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!token) return;
    apiFetch("/api/bookings/admin", {}, token)
      .then((data) => {
        if (active) setRentals(data);
      })
      .catch((err) => {
        if (active) toast.error(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, refreshKey]);

  const handleStatusChange = async (id, bookingStatus) => {
    try {
      await apiFetch(
        `/api/bookings/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ bookingStatus }) },
        token
      );
      toast.success(`Booking marked ${bookingStatus}`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">All Rentals</h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Customer Information</th>
                  <th>Owner Information</th>
                  <th>Equipment Name</th>
                  <th>Rental Duration</th>
                  <th>Booking Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No rental records found.
                    </td>
                  </tr>
                ) : (
                  rentals.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <p className="font-semibold text-slate-900">
                          {b.customerName}
                        </p>
                        <p className="text-xs text-slate-500">{b.customerEmail}</p>
                      </td>
                      <td>
                        <p className="font-semibold text-slate-900">
                          {b.ownerName}
                        </p>
                        <p className="text-xs text-slate-500">{b.ownerEmail}</p>
                      </td>
                      <td className="font-medium">{b.equipmentName}</td>
                      <td className="text-xs">
                        {b.startDate} → {b.endDate} ({b.durationDays}d)
                      </td>
                      <td className="font-bold text-teal-700">${b.totalAmount}</td>
                      <td>
                        <span
                          className={`badge capitalize ${
                            b.paymentStatus === "paid"
                              ? "badge-success text-white"
                              : "badge-warning"
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="select select-bordered select-xs"
                          value={b.bookingStatus}
                          onChange={(e) =>
                            handleStatusChange(b._id, e.target.value)
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
