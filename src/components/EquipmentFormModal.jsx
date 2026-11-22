"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  apiFetch,
  EQUIPMENT_CATEGORIES,
  RENTAL_TYPES,
  uploadImageToImgBB,
} from "@/lib/api";

export default function EquipmentFormModal({
  equipment,
  token,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    name: equipment?.name || "",
    description: equipment?.description || "",
    category: equipment?.category || EQUIPMENT_CATEGORIES[0],
    location: equipment?.location || "",
    rentalPrice: equipment?.rentalPrice || "",
    rentalType: equipment?.rentalType || "Daily",
    availableQuantity: equipment?.availableQuantity ?? 1,
    condition: equipment?.condition || "Good",
    brand: equipment?.brand || "",
    model: equipment?.model || "",
    image: equipment?.image || "",
    terms: equipment?.terms || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!equipment) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(
        `/api/equipment/${equipment._id}`,
        { method: "PATCH", body: JSON.stringify(form) },
        token
      );
      toast.success("Equipment updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-white">
        <h3 className="font-bold text-xl text-slate-900 mb-4">
          Update Equipment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-semibold">Equipment Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Category</label>
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
              <label className="label text-xs font-semibold">Location</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Rental Price ($)</label>
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
              <label className="label text-xs font-semibold">Rental Type</label>
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
              <label className="label text-xs font-semibold">
                Available Quantity
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-full"
                value={form.availableQuantity}
                onChange={(e) =>
                  setForm({ ...form, availableQuantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Brand</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Model</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label text-xs font-semibold">
              Equipment Image (Upload via imgbb or keep existing)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
            />
            {uploading && (
              <p className="text-xs text-teal-700 mt-1">Uploading image...</p>
            )}
          </div>

          <div>
            <label className="label text-xs font-semibold">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label text-xs font-semibold">
              Rental Terms & Conditions
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={2}
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
            />
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-brand"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
