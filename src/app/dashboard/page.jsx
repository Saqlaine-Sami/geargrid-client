"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Users,
  Boxes,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Heart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

function StatCard({ label, value, icon: Icon, color = "text-teal-700 bg-teal-50" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!token || !user) return;

    const loadOverview = async () => {
      try {
        if (user.role === "Admin") {
          const res = await apiFetch("/api/analytics/admin", {}, token);
          if (active) setData(res);
        } else if (user.role === "Owner") {
          const res = await apiFetch("/api/analytics/owner", {}, token);
          if (active) setData(res);
        } else {
          const [rentals, favs] = await Promise.all([
            apiFetch("/api/bookings/customer", {}, token),
            apiFetch("/api/favorites", {}, token),
          ]);
          if (active) {
            setData({ rentalsCount: rentals.length, favoritesCount: favs.length });
          }
        }
      } catch {
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOverview();
    return () => {
      active = false;
    };
  }, [token, user]);

  if (loading) return <LoadingSpinner fullScreen={false} />;

  // ADMIN ANALYTICS
  if (user?.role === "Admin" && data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Platform Analytics Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
          <StatCard label="Total Equipment" value={data.totalEquipment} icon={Boxes} />
          <StatCard label="Total Bookings" value={data.totalBookings} icon={ClipboardList} />
          <StatCard
            label="Pending Approvals"
            value={data.pendingApprovals}
            icon={Clock}
            color="text-amber-700 bg-amber-50"
          />
          <StatCard
            label="Completed Rentals"
            value={data.completedRentals}
            icon={CheckCircle2}
            color="text-emerald-700 bg-emerald-50"
          />
          <StatCard
            label="Total Revenue"
            value={`$${Number(data.totalRevenue).toFixed(2)}`}
            icon={DollarSign}
            color="text-indigo-700 bg-indigo-50"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg text-slate-900 mb-4">
            Monthly Booking Statistics
          </h2>
          {data.monthlyBookings?.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" name="Bookings" fill="#0f766e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">
              No monthly booking data yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // OWNER ANALYTICS
  if (user?.role === "Owner" && data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Owner Business Analytics
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Listed Equipment"
            value={data.totalListedEquipment}
            icon={Boxes}
          />
          <StatCard
            label="Completed Rentals"
            value={data.completedRentals}
            icon={CheckCircle2}
            color="text-emerald-700 bg-emerald-50"
          />
          <StatCard
            label="Total Earnings"
            value={`$${Number(data.totalEarnings).toFixed(2)}`}
            icon={DollarSign}
            color="text-amber-700 bg-amber-50"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg text-slate-900 mb-4">
            Monthly Earnings
          </h2>
          {data.monthlyEarnings?.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" name="Earnings ($)" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">
              No earnings recorded yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // CUSTOMER OVERVIEW
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customer Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="My Total Rentals"
          value={data?.rentalsCount || 0}
          icon={ClipboardList}
        />
        <StatCard
          label="Saved Favorites"
          value={data?.favoritesCount || 0}
          icon={Heart}
          color="text-rose-600 bg-rose-50"
        />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap gap-3">
        <Link href="/equipment" className="btn-brand">
          Browse Equipment
        </Link>
        <Link href="/dashboard/my-rentals" className="btn-brand-outline">
          View My Rentals
        </Link>
        <Link href="/dashboard/favorites" className="btn-brand-outline">
          View Favorites
        </Link>
      </div>
    </div>
  );
}
