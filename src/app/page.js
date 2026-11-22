"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  PartyPopper,
  ShieldCheck,
  BadgeDollarSign,
  CalendarClock,
  Lock,
  Star,
  CheckCircle,
  Search,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import EquipmentCard from "@/components/EquipmentCard";

const CATEGORIES = [
  { name: "Construction Equipment", icon: HardHat, desc: "Excavators, drills, generators & more" },
  { name: "Photography Equipment", icon: Camera, desc: "DSLR cameras, cinema lenses & lighting" },
  { name: "Vehicles & Transportation", icon: Truck, desc: "Cargo vans, trailers & utility trucks" },
  { name: "Agriculture Equipment", icon: Tractor, desc: "Tractors, tillers & harvesting gear" },
  { name: "Electronics", icon: Cpu, desc: "Projectors, audio mixers & work rigs" },
  { name: "Event Equipment", icon: PartyPopper, desc: "Stage lighting, tents & sound systems" },
];

const BENEFITS = [
  {
    icon: BadgeDollarSign,
    title: "Affordable Rental Prices",
    desc: "Transparent daily, weekly, and monthly rates with no hidden charges.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Equipment Owners",
    desc: "Every listing is reviewed and approved by our admin team before going live.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Rental Periods",
    desc: "Rent exactly for the duration your project needs, from one day to months.",
  },
  {
    icon: Lock,
    title: "Secure Stripe Payments",
    desc: "Encrypted online checkout with instant booking confirmation and receipts.",
  },
];

const REVIEWS = [
  {
    name: "Rafiqul Islam",
    role: "Site Contractor",
    rating: 5,
    comment:
      "Rented a concrete mixer and generator for 5 days. Smooth Stripe checkout and equipment arrived right on schedule.",
  },
  {
    name: "Nadia Rahman",
    role: "Wedding Photographer",
    rating: 5,
    comment:
      "Booked a Sony cinema kit for a weekend shoot. Saved thousands compared to buying new gear.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Event Organizer",
    rating: 4,
    comment:
      "Finding verified event sound and lighting equipment in one place made our corporate gala effortless.",
  },
  {
    name: "Farhana Karim",
    role: "Agri-Tech Manager",
    rating: 5,
    comment:
      "Clear pricing, honest equipment owners, and easy dashboard tracking for all our seasonal rentals.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Search, title: "Browse & Filter", desc: "Search approved equipment by category, location, price, or availability." },
  { step: "02", icon: CalendarClock, title: "Select Dates & Quantity", desc: "Pick your start and end dates and see the exact rental cost instantly." },
  { step: "03", icon: CreditCard, title: "Pay Securely", desc: "Complete your booking safely through Stripe Checkout." },
  { step: "04", icon: PackageCheck, title: "Receive & Return", desc: "Get your gear delivered on time and track status in your dashboard." },
];

const TRUSTED_OWNERS = [
  { name: "Apex Heavy Machinery", specialty: "Construction Equipment", location: "Dhaka", listings: "24+ Verified Items" },
  { name: "CineCraft Studio Rentals", specialty: "Photography Equipment", location: "Chattogram", listings: "18+ Verified Items" },
  { name: "GreenField Agri Gear", specialty: "Agriculture Equipment", location: "Rajshahi", listings: "15+ Verified Items" },
  { name: "PrimeStage Events Hub", specialty: "Event Equipment", location: "Sylhet", listings: "20+ Verified Items" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch("/api/equipment/featured")
      .then((data) => {
        if (active) setFeatured(data);
      })
      .catch(() => {
        if (active) setFeatured([]);
      })
      .finally(() => {
        if (active) setLoadingFeatured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* 1. Banner Section (Framer Motion) */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80"
          alt="Equipment Rental Platform Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-teal-600/30 border border-teal-400/40 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-4">
              Trusted Equipment Rental Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Rent Professional Equipment Whenever Your Project Demands It
            </h1>
            <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8">
              GearGrid connects verified equipment owners with customers who need reliable
              construction, photography, agriculture, event, and electronic equipment — with
              transparent pricing and secure Stripe checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/equipment" className="btn-brand px-6">
                Explore All Equipment
              </Link>
              <Link
                href="/register"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-slate-900 px-6"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Equipment Section (Framer Motion + MongoDB limit 6) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading">Featured Equipment</h2>
            <p className="text-slate-600 mt-2">
              Top approved equipment ready for immediate booking
            </p>
          </div>
          <Link href="/equipment" className="btn-brand-outline btn-sm self-start md:self-auto">
            View All Equipment
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
            No approved equipment available yet.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. Categories Section (Framer Motion) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="section-heading">Popular Categories</h2>
            <p className="text-slate-600 mt-2">
              Browse equipment across six major industries
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                  className="group p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-700 hover:border-teal-700 transition-all h-full flex flex-col"
                >
                  <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-700 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-600 group-hover:text-teal-100">
                    {cat.desc}
                  </p>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="section-heading">Why Choose GearGrid</h2>
          <p className="text-slate-600 mt-2">
            Built for reliability, transparency, and hassle-free equipment rentals
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Extra Section 1: How It Works */}
      <section className="bg-teal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-teal-200 mt-2">
              Rent the right equipment in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-teal-800/70 border border-teal-700 rounded-xl p-6 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-7 h-7 text-amber-400" />
                    <span className="text-2xl font-extrabold text-teal-400/60">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-teal-100 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section (4 Reviews) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="section-heading">Customer Reviews</h2>
          <p className="text-slate-600 mt-2">
            What our renters say about booking through GearGrid
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col"
            >
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                <p className="text-xs text-slate-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Extra Section 2: Trusted Equipment Owners */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="section-heading">Trusted Equipment Owners</h2>
            <p className="text-slate-600 mt-2">
              Verified partner businesses maintaining high-grade rental inventory
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUSTED_OWNERS.map((owner) => (
              <div
                key={owner.name}
                className="border border-slate-200 rounded-xl p-6 bg-slate-50 h-full flex flex-col"
              >
                <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Partner</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {owner.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3">{owner.specialty}</p>
                <div className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>{owner.location}</span>
                  <span className="font-semibold text-teal-700">{owner.listings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
