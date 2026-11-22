"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { signUp } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setPhotoUrl(url);
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      const msg = "Password must contain at least one uppercase letter.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (!/[a-z]/.test(password)) {
      const msg = "Password must contain at least one lowercase letter.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (error) {
        setErrorMsg(error.message || "Registration failed");
        toast.error(error.message || "Registration failed");
        return;
      }

      await refreshUser();
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to GearGrid Equipment Rental Platform.",
        confirmButtonColor: "#0f766e",
      });
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="card bg-white border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Join GearGrid to browse and rent equipment securely
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label text-sm font-medium">
              Photo URL (or upload via imgbb below)
            </label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full mb-2"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-sm w-full"
            />
            {uploading && (
              <p className="text-xs text-teal-700 mt-1">Uploading to imgbb...</p>
            )}
          </div>

          <div>
            <label className="label text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <div className="alert alert-error text-sm py-2 text-white">
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn-brand w-full"
          >
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
