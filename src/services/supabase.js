// KaamSetu ⇄ Supabase bridge (no extra npm dependency: talks to Supabase's REST API with fetch).
// The publishable key is meant to ship in frontend code; access is limited by the RLS policies
// defined in supabase/migration.sql.

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://mmkmfishmjbyebwkgjcm.supabase.co';
export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ENIzWOC_9ZD1qKDeLH0miQ_NCsfKIHY';

const REST = `${SUPABASE_URL}/rest/v1`;

const headers = (extra = {}) => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

let pending = 0;
export const hasPendingWrites = () => pending > 0;

async function request(path, options = {}) {
  const res = await fetch(`${REST}/${path}`, options);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${body}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Insert-or-update rows (matched on primary key / given conflict column).
export async function upsert(table, rows, onConflict) {
  pending++;
  try {
    const q = onConflict ? `?on_conflict=${onConflict}` : '';
    return await request(`${table}${q}`, {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(Array.isArray(rows) ? rows : [rows])
    });
  } finally {
    pending--;
  }
}

export async function insert(table, rows) {
  pending++;
  try {
    return await request(table, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(Array.isArray(rows) ? rows : [rows])
    });
  } finally {
    pending--;
  }
}

export async function select(table, query = 'select=*') {
  return request(`${table}?${query}`, { headers: headers() });
}

// ---------------------------------------------------------------------
// Accounts (Supabase Auth). Passwords go only to Supabase Auth, which stores
// them hashed (bcrypt) in auth.users. They are never written to app_users.
// ---------------------------------------------------------------------
const AUTH = `${SUPABASE_URL}/auth/v1`;
const SESSION_KEY = 'kaamsetu_auth_session';

// Phone sign-ups have no SMS provider yet, so a phone number is turned into a
// private login id ("p919820044102@phone.kaamsetu.app"). No mail is ever sent to it.
export const PHONE_LOGIN_DOMAIN = 'phone.kaamsetu.app';

export function parseLoginId(raw) {
  const value = (raw || '').trim();
  if (value.includes('@')) {
    const email = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
    return { kind: 'email', email, loginEmail: email };
  }
  let digits = value.replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`; // default to India
  if (digits.length < 11 || digits.length > 15) {
    return { error: 'Please enter a valid phone number (10 digits) or an email address.' };
  }
  const phone = digits.startsWith('91') && digits.length === 12
    ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    : `+${digits}`;
  return { kind: 'phone', phone, loginEmail: `p${digits}@${PHONE_LOGIN_DOMAIN}` };
}

const friendlyAuthError = (msg = '') => {
  const m = msg.toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user_already_exists'))
    return 'An account with this email / phone already exists. Please sign in instead.';
  if (m.includes('invalid login credentials')) return 'Wrong email / phone or password.';
  if (m.includes('email not confirmed'))
    return 'This account is not confirmed yet. (Admin: turn off "Confirm email" in Supabase → Authentication → Sign In / Providers → Email.)';
  if (m.includes('password should be') || m.includes('weak_password')) return 'Password must be at least 6 characters.';
  if (m.includes('not authorized') || m.includes('error sending'))
    return 'Sign-up email could not be sent. (Admin: turn off "Confirm email" in Supabase → Authentication → Sign In / Providers → Email.)';
  if (m.includes('signups not allowed')) return 'New sign-ups are switched off in Supabase (Authentication → Sign In / Providers).';
  if (m.includes('failed to fetch') || m.includes('network')) return 'No internet connection. Please try again.';
  return msg || 'Something went wrong. Please try again.';
};

async function authRequest(path, body) {
  let res;
  try {
    res = await fetch(`${AUTH}/${path}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw new Error(friendlyAuthError('failed to fetch'));
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(friendlyAuthError(json.msg || json.error_description || json.message || json.error_code || json.error));
  }
  return json;
}

const saveSession = (s) => {
  if (s && s.access_token) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
};
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
};

// Create an account. `profile` (role, name, ...) is kept in the account's metadata too.
export async function signUpWithPassword(loginEmail, password, profile = {}) {
  const json = await authRequest('signup', { email: loginEmail, password, data: profile });
  const session = json.access_token ? json : null;
  const user = json.user || (json.id ? json : null);
  if (session) saveSession(session);
  return { session, user };
}

export async function signInWithPassword(loginEmail, password) {
  const json = await authRequest('token?grant_type=password', { email: loginEmail, password });
  saveSession(json);
  return { session: json, user: json.user };
}

export async function signOut() {
  const s = getSession();
  localStorage.removeItem(SESSION_KEY);
  if (!s) return;
  fetch(`${AUTH}/logout`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${s.access_token}` }
  }).catch(() => {});
}
