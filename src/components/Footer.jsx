"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";

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
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.4H7.5v3.2h2.7V22h3.3z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
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
