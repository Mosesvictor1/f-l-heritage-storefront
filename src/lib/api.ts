import axios from "axios";

const FALLBACK = "https://script.google.com/macros/s/AKfycbyIZER_Mu_lF3lgIW9L6vWStCoEGJdDf3oPHKwNGQe49p4SnmHDl7cHrP7OhwACWktMEA/exec";
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || FALLBACK;
const CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || "decbrtduj";
const UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined) || "unsigned_preset";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "text/plain;charset=utf-8" },
});

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || "";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function apiGet<T = unknown>(resource: string, params: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
  const res = await api.get("", { params: { resource, token: getToken(), ...params } });
  return res.data as ApiResponse<T>;
}

export async function apiPost<T = unknown>(
  resource: string,
  data: Record<string, unknown> = {},
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  id: string = "",
  sub: string = "",
): Promise<ApiResponse<T>> {
  const res = await api.post(
    "",
    JSON.stringify({ resource, id, sub, _method: method, data, token: getToken() }),
  );
  return res.data as ApiResponse<T>;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url as string;
}

export function formatNaira(n: number | string | undefined | null): string {
  const num = Number(n || 0);
  return "₦" + num.toLocaleString("en-NG", { maximumFractionDigits: num % 1 === 0 ? 0 : 2 });
}

export function handleUnauthorized(message?: string) {
  if (!message) return;
  if (/unauthor/i.test(message) && typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin/login";
  }
}