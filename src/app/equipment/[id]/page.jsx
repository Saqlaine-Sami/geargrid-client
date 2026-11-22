"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  MapPin,
  Tag,
  Heart,
  CalendarCheck,
  User,
  ShieldAlert,
  Boxes,
} from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, calculateRentalCost } from "@/lib/api";

function EquipmentDetailsContent() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token || !id) return;

    const loadData = async () => {
      try {
        const data = await apiFetch(`/api/equipment/${id}`, {}, token);
        if (!active) return;
        setItem(data);

        if (user?.role === "Customer") {
          const favs = await apiFetch("/api/favorites", {}, token);
          if (active) {
            setIsFavorite(favs.some((f) => f.equipmentId === id));
          }
        }
      } catch (err) {
        if (active) toast.error(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [id, token, user?.role]);

  const handleToggleFavorite = async () => {
    if (user?.role !== "Customer") {
      toast.error("Only customers can save favorites.");
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await apiFetch(`/api/favorites/${id}`, { method: "DELETE" }, token);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await apiFetch(
          "/api/favorites",
          { method: "POST", body: JSON.stringify({ equipmentId: id }) },
          token
        );
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFavLoading(false);
    }
  };

  const { days, total } = calculateRentalCost(
    startDate,
    endDate,
    item?.rentalPrice || 0,
    item?.rentalType || "Daily",
    requiredQuantity
  );

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date.");
      return;
    }
    if (Number(requiredQuantity) > Number(item.availableQuantity)) {
      toast.error(`Only ${item.availableQuantity} unit(s) available.`);
      return;
    }

    setBookingLoading(true);
    try {
      const res = await apiFetch(
        "/api/bookings/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            equipmentId: item._id,
            startDate,
            endDate,
            requiredQuantity: Number(requiredQuantity),
            contactNumber,
            deliveryAddress,
            additionalNotes,
          }),
        },
        token
      );
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(err.message);
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-semibold">Equipment not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Equipment Image */}
        <div className="bg-slate-100 h-80 lg:h-auto min-h-[380px]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Equipment Details */}
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="badge bg-teal-50 text-teal-800 border border-teal-200 py-3 px-3 gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5" />
              {item.category}
            </span>
            <span
              className={`badge py-3 px-3 font-semibold ${
                item.availableQuantity > 0
                  ? "bg-emerald-100 text-emerald-800 border-none"
                  : "bg-rose-100 text-rose-800 border-none"
              }`}
            >
              {item.availableQuantity > 0 ? "Available" : "Out of Stock"}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {item.name}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Rental Price</p>
              <p className="font-bold text-xl text-teal-700">
                ${item.rentalPrice}{" "}
                <span className="text-xs font-normal text-slate-500">
                  / {item.rentalType}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Available Quantity</p>
              <p className="font-bold text-lg text-slate-900 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-teal-700" />
                {item.availableQuantity} unit(s)
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Location</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                {item.location}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Brand / Model / Condition</p>
              <p className="font-semibold text-slate-800">
                {[item.brand, item.model, item.condition].filter(Boolean).join(" • ") || "Standard"}
              </p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="border border-slate-200 rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-700" /> Owner Information
            </h3>
            <p className="font-semibold text-slate-900">{item.ownerName}</p>
            <p className="text-sm text-slate-600">{item.ownerEmail}</p>
          </div>

          {/* Rental Terms & Conditions */}
          <div className="border border-slate-200 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Rental Terms & Conditions
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.terms || "Return equipment in good working condition on or before the end date."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-auto">
            {user?.role === "Customer" ? (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  disabled={item.availableQuantity < 1 || item.status !== "Approved"}
                  className="btn-brand flex-1 gap-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book Now
                </button>
                <button
                  onClick={handleToggleFavorite}
                  disabled={favLoading}
                  className={`btn gap-2 ${
                    isFavorite
                      ? "bg-rose-600 hover:bg-rose-700 text-white border-none"
                      : "btn-brand-outline"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Remove Favorite" : "Add to Favorites"}
                </button>
              </>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg w-full">
                Logged in as <strong>{user?.role}</strong>. Switch to a Customer account to
                book or favorite equipment.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg bg-white">
            <h3 className="font-bold text-xl text-slate-900 mb-1">
              Book {item.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rate: ${item.rentalPrice} / {item.rentalType} (Available: {item.availableQuantity})
            </p>

            <form onSubmit={handleConfirmBooking} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-semibold">Rental Start Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="input input-bordered w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs font-semibold">Rental End Date</label>
                  <input
                    type="date"
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="input input-bordered w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-semibold">Required Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={item.availableQuantity}
                    className="input input-bordered w-full"
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs font-semibold">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    className="input input-bordered w-full"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs font-semibold">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Full delivery street address"
                  className="input input-bordered w-full"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-semibold">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional delivery or usage notes..."
                  className="textarea textarea-bordered w-full"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-800 font-medium">
                    Estimated Total ({days > 0 ? `${days} day(s)` : "Select dates"})
                  </p>
                  <p className="text-xs text-slate-500">
                    Redirecting to Stripe Checkout upon confirmation
                  </p>
                </div>
                <p className="text-2xl font-extrabold text-teal-800">${total}</p>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || total <= 0}
                  className="btn-brand"
                >
                  {bookingLoading ? "Redirecting to Stripe..." : "Confirm & Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <PrivateRoute>
      <EquipmentDetailsContent />
    </PrivateRoute>
  );
}
