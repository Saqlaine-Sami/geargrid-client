"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EquipmentFormModal from "@/components/EquipmentFormModal";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function MyEquipmentPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const loadEquipment = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch("/api/equipment/owner/me", {}, token);
      setItems(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this equipment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/api/equipment/${id}`, { method: "DELETE" }, token);
      toast.success("Equipment deleted");
      loadEquipment();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Owner"]}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">My Equipment</h1>
          <Link href="/dashboard/add-equipment" className="btn-brand btn-sm">
            + Add Equipment
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Rental Price</th>
                  <th>Available Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      You have not added any equipment yet.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td className="font-semibold text-slate-900">{item.name}</td>
                      <td>{item.category}</td>
                      <td>
                        ${item.rentalPrice} / {item.rentalType}
                      </td>
                      <td>{item.availableQuantity}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Approved"
                              ? "badge-success text-white"
                              : item.status === "Rejected"
                              ? "badge-error text-white"
                              : "badge-warning"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="btn btn-xs btn-info text-white"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-xs btn-error text-white"
                          >
                            Delete
                          </button>
                          <Link
                            href={`/equipment/${item._id}`}
                            className="btn btn-xs btn-outline"
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {editingItem && (
          <EquipmentFormModal
            key={editingItem._id}
            equipment={editingItem}
            token={token}
            onClose={() => setEditingItem(null)}
            onUpdated={loadEquipment}
          />
        )}
      </div>
    </PrivateRoute>
  );
}
