"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { apiFetch, EQUIPMENT_CATEGORIES, RENTAL_TYPES } from "@/lib/api";
import EquipmentCard from "@/components/EquipmentCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 6;

function AllEquipmentContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [rentalType, setRentalType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category !== "All") params.append("category", category);
      if (rentalType !== "All") params.append("rentalType", rentalType);
      if (minPrice !== "") params.append("minPrice", minPrice);
      if (maxPrice !== "") params.append("maxPrice", maxPrice);
      if (availability !== "all") params.append("availability", availability);
      if (sort) params.append("sort", sort);
      params.append("page", String(page));
      params.append("limit", String(ITEMS_PER_PAGE));

      const data = await apiFetch(`/api/equipment?${params.toString()}`);
      if (Array.isArray(data)) {
        setEquipment(data);
        setTotalItems(data.length);
        setTotalPages(1);
      } else {
        setEquipment(data.items || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      setEquipment([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, category, rentalType, minPrice, maxPrice, availability, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEquipment]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setRentalType("All");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="section-heading">All Equipment</h1>
        <p className="text-slate-600 mt-2">
          Search, filter, and sort verified rental equipment
        </p>
      </div>

      {/* Backend Search, Filter & Sort Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by equipment name, location, or category..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={rentalType}
            onChange={(e) => {
              setRentalType(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Rental Types</option>
            {RENTAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="number"
            min="0"
            placeholder="Min Price ($)"
            className="input input-bordered w-full"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="number"
            min="0"
            placeholder="Max Price ($)"
            className="input input-bordered w-full"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="select select-bordered w-full"
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Availability</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            className="select select-bordered w-full"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">Sort: Recently Added</option>
            <option value="price_asc">Sort: Price Low to High</option>
            <option value="price_desc">Sort: Price High to Low</option>
          </select>
          <button
            onClick={handleReset}
            className="btn btn-outline border-slate-300 text-slate-700 gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* 3-Column Equipment Grid */}
      {loading ? (
        <LoadingSpinner fullScreen={false} />
      ) : equipment.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-lg font-semibold text-slate-800">
            No matching equipment found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search keywords or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalItems}
            onPageChange={(nextPage) => {
              setPage(nextPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AllEquipmentContent />
    </Suspense>
  );
}
