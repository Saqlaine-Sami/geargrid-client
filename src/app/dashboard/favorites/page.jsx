"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!token) return;
    apiFetch("/api/favorites", {}, token)
      .then((data) => {
        if (active) setFavorites(data);
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

  const handleRemove = async (equipmentId) => {
    try {
      await apiFetch(`/api/favorites/${equipmentId}`, { method: "DELETE" }, token);
      toast.success("Removed from favorites");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Customer"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">Favorite Equipment</h1>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No favorite equipment saved yet.
                    </td>
                  </tr>
                ) : (
                  favorites.map((fav) => (
                    <tr key={fav._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={fav.image}
                            alt={fav.equipmentName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-semibold text-slate-900">
                            {fav.equipmentName}
                          </span>
                        </div>
                      </td>
                      <td>{fav.category}</td>
                      <td className="font-semibold">
                        ${fav.rentalPrice} / {fav.rentalType}
                      </td>
                      <td>{fav.location}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/equipment/${fav.equipmentId}`}
                            className="btn-brand btn-xs"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleRemove(fav.equipmentId)}
                            className="btn btn-error btn-xs text-white"
                          >
                            Remove Favorite
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
      </div>
    </PrivateRoute>
  );
}
