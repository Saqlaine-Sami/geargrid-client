"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function MyEquipmentRentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRentals = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch("/api/bookings/owner", {}, token);
      setRentals(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const handleStatusChange = async (id, bookingStatus) => {
    try {
      await apiFetch(
        `/api/bookings/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ bookingStatus }) },
        token
      );
      toast.success(`Booking status updated to ${bookingStatus}`);
      loadRentals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Owner"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">
          My Equipment Rentals
        </h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Customer Information</th>
                  <th>Equipment Information</th>
                  <th>Rental Duration</th>
                  <th>Required Quantity</th>
                  <th>Booking Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No rental bookings for your equipment yet.
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
                        <p className="text-xs text-slate-500">{b.contactNumber}</p>
                      </td>
                      <td>
                        <p className="font-semibold">{b.equipmentName}</p>
                        <p className="text-xs text-slate-500">
                          {b.equipmentCategory}
                        </p>
                      </td>
                      <td className="text-xs">
                        {b.startDate} to {b.endDate} ({b.durationDays}d)
                      </td>
                      <td>{b.requiredQuantity}</td>
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
