"use client";

import Link from "next/link";
import { Wrench, Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white">
              Gear<span className="text-teal-400">Grid</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            A transparent and secure equipment rental marketplace connecting verified
            equipment owners with renters nationwide.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-teal-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/equipment" className="hover:text-teal-400 transition-colors">
                All Equipment
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <p className="text-sm text-slate-400 mb-4">
            support@geargrid-rentals.com
          </p>
          <div className="flex items-center gap-3">
            {/* New X (Twitter rebrand) logo */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} GearGrid Equipment Rental Platform. All rights reserved.
      </div>
    </footer>
  );
}
