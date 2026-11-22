"use client";

import { useRouter } from "next/navigation";
import { MapPin, Tag, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EquipmentCard({ item }) {
  const { user } = useAuth();
  const router = useRouter();
  const isAvailable = Number(item.availableQuantity) > 0;

  const handleViewDetails = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/equipment/${item._id}`);
    }
  };

  return (
    <div className="card bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden">
      <figure className="relative h-52 w-full bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <span
          className={`badge absolute top-3 right-3 border-none font-semibold text-xs ${
            isAvailable
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {isAvailable ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Available
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Unavailable
            </span>
          )}
        </span>
      </figure>

      <div className="card-body p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700 mb-1">
          <Tag className="w-3.5 h-3.5" />
          <span>{item.category}</span>
        </div>

        <h3 className="card-title text-lg font-bold text-slate-900 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
          <MapPin className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="line-clamp-1">{item.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xl font-bold text-slate-900">
              ${item.rentalPrice}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              / {item.rentalType}
            </span>
          </div>
          <button
            onClick={handleViewDetails}
            className="btn-brand btn-sm px-4"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
