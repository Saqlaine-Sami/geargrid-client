"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const PAGE_LIMIT = 5;

export default function MyEquipmentRentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    if (!token) return;
    apiFetch(`/api/bookings/owner?page=${page}&limit=${PAGE_LIMIT}`, {}, token)
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setRentals(data);
          setTotal(data.length);
          setTotalPages(1);
        } else {
          setRentals(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
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
  }, [token, refreshKey, page]);

  const handleStatusChange = async (id, bookingStatus) => {
    try {
      await apiFetch(
        `/api/bookings/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ bookingStatus }) },
        token
      );
      toast.success(`Booking status updated to ${bookingStatus}`);
      setRefreshKey((k) => k + 1);
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
          <>
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
                          <p className="text-xs text-slate-500">
                            {b.customerEmail}
                          </p>
                          <p className="text-xs text-slate-500">
                            {b.contactNumber}
                          </p>
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
                        <td className="font-bold text-teal-700">
                          ${b.totalAmount}
                        </td>
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

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </PrivateRoute>
  );
}
