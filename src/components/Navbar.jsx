"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, Menu, LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinkClass = (path) =>
    `font-medium transition-colors ${
      pathname === path
        ? "text-teal-700 font-semibold"
        : "text-slate-700 hover:text-teal-700"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <Menu className="w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-50 p-3 shadow-lg bg-white rounded-xl w-52 border border-slate-200 space-y-1"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/equipment">All Equipment</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-rose-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Gear<span className="text-teal-700">Grid</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6">
            <li>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/equipment" className={navLinkClass("/equipment")}>
                All Equipment
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="btn-brand btn-sm gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn-brand-outline btn-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn-brand btn-sm">
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
