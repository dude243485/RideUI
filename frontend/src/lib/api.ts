// RideUI Central API Client

const TOKEN_KEY = 'rideui_token';
const USER_KEY = 'rideui_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: any) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): any | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg) as any;
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ---------------- AUTH API ----------------

export async function registerRider(payload: {
  name: string;
  email: string;
  phone: string;
  password?: string;
}) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password || 'password123',
      role: 'rider',
    }),
  });
  setSession(res.accessToken, res.user);
  return res;
}

export async function loginRider(emailOrPhone: string, password = 'password123') {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: emailOrPhone, password }),
  });
  setSession(res.accessToken, res.user);
  return res;
}

export async function registerDriver(payload: {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  vehicleType: 'keke' | 'car';
  plateNumber: string;
}) {
  const normalizedEmail = payload.email || `${payload.phone.replace(/[^0-9]/g, '')}@driver.ui.edu.ng`;
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      email: normalizedEmail,
      phone: payload.phone,
      password: payload.password || '1234',
      role: 'driver',
      vehicleType: payload.vehicleType,
      plateNumber: payload.plateNumber,
    }),
  });
  setSession(res.accessToken, res.user);
  return res;
}

export async function loginDriver(emailOrPhone: string, password = '1234') {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: emailOrPhone, password }),
  });
  setSession(res.accessToken, res.user);
  return res;
}

// ---------------- STOPS & FARE API ----------------

export async function fetchCampusStops() {
  return apiFetch('/api/stops');
}

export async function fetchFareEstimate(pickup: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
  return apiFetch('/api/fare', {
    method: 'POST',
    body: JSON.stringify({ pickup, destination }),
  });
}

// ---------------- RIDE API ----------------

export async function bookRide(payload: {
  pickup: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
  driverId?: string;
}) {
  return apiFetch('/api/rides', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getRideDetails(rideId: string) {
  return apiFetch(`/api/rides/${rideId}`);
}

export async function cancelRideRequest(rideId: string) {
  return apiFetch(`/api/rides/${rideId}/cancel`, {
    method: 'PATCH',
  });
}

// ---------------- DRIVER DASHBOARD API ----------------

export async function setDriverStatus(
  status: 'available' | 'busy' | 'offline',
  hubId?: string | null,
  coordinates?: { lat: number; lng: number }
) {
  return apiFetch('/api/drivers/status', {
    method: 'PATCH',
    body: JSON.stringify({ status, hubId, coordinates }),
  });
}

export async function getPendingDriverRequests() {
  return apiFetch('/api/rides?driver=me&status=requested');
}

export async function respondToDriverRide(rideId: string, action: 'accept' | 'decline') {
  return apiFetch(`/api/rides/${rideId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

export async function markRideCompleted(rideId: string) {
  return apiFetch(`/api/rides/${rideId}/complete`, {
    method: 'PATCH',
  });
}

export async function seedLiveDrivers() {
  return apiFetch('/api/drivers/seed-demo', {
    method: 'POST',
  });
}
