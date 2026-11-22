"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function AllUsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!token) return;
    apiFetch("/api/users", {}, token)
      .then((data) => {
        if (active) setUsers(data);
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

  const handleRoleChange = async (id, role) => {
    try {
      await apiFetch(
        `/api/users/${id}/role`,
        { method: "PATCH", body: JSON.stringify({ role }) },
        token
      );
      toast.success(`Role updated to ${role}`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (email === user?.email) {
      toast.error("You cannot delete your own account.");
      return;
    }
    const res = await Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;

    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" }, token);
      toast.success("User deleted");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">All Users</h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-semibold text-slate-900">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="select select-bordered select-xs"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u._id, u.email)}
                        disabled={u.email === user?.email}
                        className="btn btn-xs btn-error text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
