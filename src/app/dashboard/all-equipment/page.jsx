"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EquipmentFormModal from "@/components/EquipmentFormModal";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function AdminAllEquipmentPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const loadAll = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch("/api/equipment/admin/all", {}, token);
      setItems(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleStatus = async (id, status) => {
    try {
      await apiFetch(
        `/api/equipment/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
        token
      );
      toast.success(`Equipment ${status}`);
      loadAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete equipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;
    try {
      await apiFetch(`/api/equipment/${id}`, { method: "DELETE" }, token);
      toast.success("Equipment deleted");
      loadAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">All Equipment</h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Equipment</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No equipment found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td className="font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td>
                        <p className="text-sm">{item.ownerName}</p>
                        <p className="text-xs text-slate-500">
                          {item.ownerEmail}
                        </p>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        ${item.rentalPrice} / {item.rentalType}
                      </td>
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
                            onClick={() => handleStatus(item._id, "Approved")}
                            disabled={item.status === "Approved"}
                            className="btn btn-xs btn-success text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(item._id, "Rejected")}
                            disabled={item.status === "Rejected"}
                            className="btn btn-xs btn-warning"
                          >
                            Reject
                          </button>
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
            onUpdated={loadAll}
          />
        )}
      </div>
    </PrivateRoute>
  );
}
