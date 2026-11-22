"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import {
  apiFetch,
  EQUIPMENT_CATEGORIES,
  RENTAL_TYPES,
  uploadImageToImgBB,
} from "@/lib/api";

export default function AddEquipmentPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: EQUIPMENT_CATEGORIES[0],
    location: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: 1,
    condition: "New",
    brand: "",
    model: "",
    image: "",
    terms: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded via imgbb!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please upload an equipment image using imgbb.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(
        "/api/equipment",
        { method: "POST", body: JSON.stringify(form) },
        token
      );
      await Swal.fire({
        icon: "success",
        title: "Equipment Submitted!",
        text: "Your equipment is now Pending admin approval.",
        confirmButtonColor: "#0f766e",
      });
      router.push("/dashboard/my-equipment");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrivateRoute allowedRoles={["Owner"]}>
      <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Add New Equipment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-sm font-semibold">Equipment Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">Category</label>
              <select
                className="select select-bordered w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm font-semibold">Location</label>
              <input
                type="text"
                placeholder="City / Area"
                className="input input-bordered w-full"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">Rental Price ($)</label>
              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                value={form.rentalPrice}
                onChange={(e) =>
                  setForm({ ...form, rentalPrice: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">Rental Type</label>
              <select
                className="select select-bordered w-full"
                value={form.rentalType}
                onChange={(e) =>
                  setForm({ ...form, rentalType: e.target.value })
                }
              >
                {RENTAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm font-semibold">
                Available Quantity
              </label>
              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                value={form.availableQuantity}
                onChange={(e) =>
                  setForm({ ...form, availableQuantity: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">
                Equipment Condition
              </label>
              <select
                className="select select-bordered w-full"
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="label text-sm font-semibold">Brand</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">Model</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label text-sm font-semibold">Status</label>
              <input
                type="text"
                className="input input-bordered w-full bg-slate-100"
                value="Pending"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="label text-sm font-semibold">
              Equipment Image (Upload via imgbb)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
              required={!form.image}
            />
            {uploading && (
              <p className="text-xs text-teal-700 mt-1">Uploading to imgbb...</p>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-3 h-36 w-56 object-cover rounded-lg border border-slate-200"
              />
            )}
          </div>

          <div>
            <label className="label text-sm font-semibold">Description</label>
            <textarea
              rows={3}
              className="textarea textarea-bordered w-full"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">
              Rental Terms and Conditions
            </label>
            <textarea
              rows={3}
              className="textarea textarea-bordered w-full"
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              required
            />
          </div>

          {/* Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="label text-xs font-semibold">Owner Name</label>
              <input
                type="text"
                className="input input-bordered input-sm w-full bg-slate-100"
                value={user?.name || ""}
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Owner Email</label>
              <input
                type="text"
                className="input input-bordered input-sm w-full bg-slate-100"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn-brand w-full md:w-auto px-8"
          >
            {submitting ? "Submitting..." : "Add Equipment"}
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
}
