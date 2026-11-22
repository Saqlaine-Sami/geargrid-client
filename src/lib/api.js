export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const EQUIPMENT_CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

export async function apiFetch(endpoint, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function uploadImageToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey || apiKey === "your_imgbb_api_key") {
    throw new Error("Please set NEXT_PUBLIC_IMGBB_API_KEY in .env.local");
  }
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error("Image upload to imgbb failed");
  }
  return data.data.display_url;
}

export function calculateRentalCost(startDate, endDate, price, rentalType, quantity) {
  if (!startDate || !endDate) return { days: 0, total: 0 };
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) return { days: 0, total: 0 };

  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  let units = days;
  if (rentalType === "Weekly") units = Math.max(1, Math.ceil(days / 7));
  if (rentalType === "Monthly") units = Math.max(1, Math.ceil(days / 30));

  return {
    days,
    total: Number((units * Number(price) * Number(quantity || 1)).toFixed(2)),
  };
}
