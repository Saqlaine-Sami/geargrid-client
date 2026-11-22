"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, uploadImageToImgBB } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { token, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    address: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token) return;

    apiFetch("/api/users/me", {}, token)
      .then((data) => {
        if (!active) return;
        setForm({
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          phone: data.phone || "",
          address: data.address || "",
          role: data.role || "Customer",
        });
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
  }, [token]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Profile photo uploaded!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(
        "/api/users/me",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            image: form.image,
            phone: form.phone,
            address: form.address,
          }),
        },
        token
      );
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
        <img
          src={
            form.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              form.name || "U"
            )}&background=0f766e&color=fff`
          }
          alt={form.name}
          className="w-16 h-16 rounded-full object-cover border border-slate-200"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{form.name}</h1>
          <p className="text-sm text-slate-500">{form.email}</p>
          <span className="badge bg-teal-50 text-teal-800 border-teal-200 mt-1 text-xs font-semibold">
            {form.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="label text-sm font-semibold">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label text-sm font-semibold">Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-slate-100"
            value={form.email}
            disabled
          />
        </div>

        <div>
          <label className="label text-sm font-semibold">Profile Image URL</label>
          <input
            type="url"
            className="input input-bordered w-full mb-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="file-input file-input-bordered file-input-sm w-full"
          />
          {uploading && <p className="text-xs text-teal-700 mt-1">Uploading...</p>}
        </div>

        <div>
          <label className="label text-sm font-semibold">Phone Number</label>
          <input
            type="tel"
            placeholder="+8801XXXXXXXXX"
            className="input input-bordered w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="label text-sm font-semibold">Address</label>
          <textarea
            rows={2}
            placeholder="Your address"
            className="textarea textarea-bordered w-full"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-brand"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
