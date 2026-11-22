"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const PAGE_LIMIT = 5;

export default function MyRentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    if (!token) return;

    apiFetch(`/api/bookings/customer?page=${page}&limit=${PAGE_LIMIT}`, {}, token)
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
  }, [token, page]);

  return (
    <PrivateRoute allowedRoles={["Customer"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">My Rentals</h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th>Equipment Name</th>
                    <th>Rental Start Date</th>
                    <th>Rental End Date</th>
                    <th>Booking Date</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Booking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        You have no rental bookings yet.
                      </td>
                    </tr>
                  ) : (
                    rentals.map((b) => (
                      <tr key={b._id}>
                        <td className="font-semibold text-slate-900">
                          {b.equipmentName}
                        </td>
                        <td>{b.startDate}</td>
                        <td>{b.endDate}</td>
                        <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
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
                          <span className="badge badge-outline capitalize">
                            {b.bookingStatus}
                          </span>
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
