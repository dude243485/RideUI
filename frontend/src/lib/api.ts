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

export async function loginRider(email: string, password = 'password123') {
  const trimmedEmail = email.trim().toLowerCase();
  const normalizedEmail = trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@ui.edu.ng`;

  try {
    // Try logging in
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    setSession(res.accessToken, res.user);
    return res;
  } catch (err: any) {
    // For demo ease: if rider credentials not found, auto-register and login!
    if (err.status === 401 || err.status === 404) {
      const regRes = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: trimmedEmail.split('@')[0] || 'Rider',
          email: normalizedEmail,
          password,
          role: 'rider',
        }),
      });
      setSession(regRes.accessToken, regRes.user);
      return regRes;
    }
    throw err;
  }
}

export async function loginDriver(driverCode: string, pin = '1234') {
  const normalizedEmail = `${driverCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@driver.ui.edu.ng`;

  try {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password: pin }),
    });
    setSession(res.accessToken, res.user);

    // Ensure driver profile exists
    try {
      await apiFetch('/api/drivers', {
        method: 'POST',
        body: JSON.stringify({
          plateNumber: `OYO-${driverCode.slice(-4) || '2456'}`,
          vehicleType: 'keke',
          status: 'available',
        }),
      });
    } catch {
      // Profile may already exist
    }

    return res;
  } catch (err: any) {
    // Auto-create driver for demo
    const regRes = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: `Driver ${driverCode}`,
        email: normalizedEmail,
        password: pin,
        role: 'driver',
      }),
    });
    setSession(regRes.accessToken, regRes.user);

    try {
      await apiFetch('/api/drivers', {
        method: 'POST',
        body: JSON.stringify({
          plateNumber: `OYO-${driverCode.slice(-4) || '2456'}`,
          vehicleType: 'keke',
          status: 'available',
        }),
      });
    } catch {
      // Ignore
    }

    return regRes;
  }
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
  driverId: string;
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

export async function setDriverStatus(status: 'available' | 'busy' | 'offline', hubId?: string | null) {
  return apiFetch('/api/drivers/status', {
    method: 'PATCH',
    body: JSON.stringify({ status, hubId }),
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
