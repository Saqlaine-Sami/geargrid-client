"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Heart,
  UserCircle,
  PlusCircle,
  Package,
  CalendarClock,
  Users,
  Boxes,
  Home,
  LogOut,
  Menu,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  const customerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-rentals", label: "My Rentals", icon: ClipboardList },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ];

  const ownerLinks = [
    { href: "/dashboard", label: "Analytics Overview", icon: LayoutDashboard },
    { href: "/dashboard/add-equipment", label: "Add Equipment", icon: PlusCircle },
    { href: "/dashboard/my-equipment", label: "My Equipment", icon: Package },
    {
      href: "/dashboard/my-equipment-rentals",
      label: "My Equipment Rental",
      icon: CalendarClock,
    },
    { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Admin Analytics", icon: LayoutDashboard },
    { href: "/dashboard/all-users", label: "All Users", icon: Users },
    { href: "/dashboard/all-equipment", label: "All Equipment", icon: Boxes },
    { href: "/dashboard/all-rentals", label: "All Rentals", icon: ClipboardList },
    { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
  ];

  const roleLinks =
    user?.role === "Admin"
      ? adminLinks
      : user?.role === "Owner"
      ? ownerLinks
      : customerLinks;

  return (
    <PrivateRoute>
      <div className="drawer lg:drawer-open min-h-screen bg-slate-50">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Main Full-Width Dashboard Content */}
        <div className="drawer-content flex flex-col">
          <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-ghost btn-sm lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </label>
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {user?.role} Dashboard
                </h2>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="badge bg-teal-50 text-teal-800 border-teal-200 font-semibold">
                {user?.role}
              </span>
              <img
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "U"
                  )}&background=0f766e&color=fff`
                }
                alt={user?.name || "User"}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            </div>
          </header>

          <main className="p-4 lg:p-8 flex-1 w-full">{children}</main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-40">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <aside className="w-64 min-h-full bg-slate-900 text-slate-200 flex flex-col p-4">
            <Link href="/" className="flex items-center gap-2.5 px-2 py-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Gear<span className="text-teal-400">Grid</span>
              </span>
            </Link>

            <ul className="space-y-1 flex-1">
              {roleLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-teal-700 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </PrivateRoute>
  );
}
