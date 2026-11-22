"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowedRolesKey = allowedRoles.join(",");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const rolesList = allowedRolesKey ? allowedRolesKey.split(",") : [];
    if (rolesList.length > 0 && !rolesList.includes(user.role)) {
      toast.error("You are not authorized to access this section.");
      router.replace("/dashboard");
    }
  }, [user, loading, allowedRolesKey, router]);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <LoadingSpinner />;
  }

  return children;
}
