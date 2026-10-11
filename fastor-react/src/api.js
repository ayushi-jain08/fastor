const BASE =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "" : "https://staging.fastor.ai");

export const CITY_ID = import.meta.env.VITE_CITY_ID ?? "118";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body) headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? new URLSearchParams(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  let json = null;
  try {
    json = await res.json();
  } catch {

  }

  if (!res.ok) {
    const message =
      json?.message ||
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      `Something went wrong (${res.status}).`;
    throw new ApiError(message, res.status);
  }
  return json;
}

export const registerPhone = (phone, dialCode) =>
  request("/v1/pwa/user/register", { method: "POST", body: { phone, dial_code: dialCode } });

export async function loginWithOtp(phone, dialCode, otp) {
  const json = await request("/v1/pwa/user/login", {
    method: "POST",
    body: { phone, dial_code: dialCode, otp },
  });
  const token = json?.data?.token ?? json?.token;
  if (!token) throw new ApiError("Login worked but no token came back. Please try again.", 200);
  return token;
}

export async function fetchRestaurants(token, signal) {
  const json = await request(`/v1/m/restaurant?city_id=${encodeURIComponent(CITY_ID)}/&&`, {
    token,
    signal,
  });
  return normalizeRestaurants(json);
}

function findList(json) {
  const root = json?.data ?? json;
  if (Array.isArray(root)) return root;
  for (const key of ["results", "restaurants", "items", "rows", "list", "data"]) {
    if (Array.isArray(root?.[key])) return root[key];
  }
  return [];
}

function firstImage(r) {
  const candidates = [r.images, r.image, r.cover_image, r.cover, r.logo, r.thumbnail, r.photo];
  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") return c;
    if (Array.isArray(c) && c.length) {
      const f = c[0];
      return typeof f === "string" ? f : f?.url ?? f?.src ?? null;
    }
    if (typeof c === "object") return c.url ?? c.src ?? null;
  }
  return null;
}

function toCuisines(r) {
  const raw = r.cuisines ?? r.cuisine ?? r.cuisine_name ?? r.cuisine_names ?? [];
  const list = Array.isArray(raw) ? raw : String(raw).split(/[,|]/);
  return list
    .map((c) => (typeof c === "string" ? c : c?.name ?? c?.cuisine_name ?? ""))
    .map((c) => c.trim())
    .filter(Boolean);
}

function toPrice(cost) {
  if (cost == null || cost === "") return null;
  const n = Number(String(cost).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function normalizeRestaurants(json) {
  return findList(json).map((r, i) => {
    const rating = Number(r.rating ?? r.avg_rating ?? r.average_rating ?? r.ratings);
    return {
      id: r.restaurant_id ?? r.id ?? r._id ?? i,
      name: r.restaurant_name ?? r.name ?? r.brand_name ?? r.title ?? "Untitled restaurant",
      image: firstImage(r),
      location:
        r.location_name ?? r.locality ?? r.area ?? r.address ?? r.city_name ?? r.location ?? "",
      rating: Number.isFinite(rating) && rating > 0 ? rating : null,
      cuisines: toCuisines(r),
      cost: r.costForTwo ?? r.cost_for_two ?? r.avg_cost_for_two ?? r.average_cost ?? null,
      price: toPrice(r.costForTwo ?? r.cost_for_two ?? r.avg_cost_for_two ?? r.average_cost),
      description: r.description ?? r.about ?? r.tagline ?? r.short_description ?? "",
      raw: r,
    };
  });
}
