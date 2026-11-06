// KaamSetu Database Service: Supabase is the single source of truth.
// Users, bookings, workers, service categories and chat messages all live in Supabase.
// loadDatabase() must finish before the app renders (see main.jsx); after that the
// data is kept in memory and refreshed from Supabase every few seconds.

import { SERVICE_CATEGORIES, WORKERS_DATABASE } from '../data/mockData';
import { upsert, insert, select, hasPendingWrites } from './supabase';

export const DB_SYNC_EVENT = 'kaamsetu-db-sync';

// In-memory copy of what is in Supabase. Never persisted in the browser.
let users = [];
let bookings = [];
let sessionUser = null;

// Writes that have not reached Supabase yet (kept + retried so nothing is lost).
const unsyncedBookings = new Map();
const unsyncedUsers = new Map();

const userKey = (u) => u.phone || u.email;

// --- USERS OPERATIONS ---
export const getUsers = () => users;

export const saveUser = (user) => {
  const existingIndex = users.findIndex(u =>
    (user.authUserId && u.authUserId === user.authUserId) ||
    (user.phone && u.phone === user.phone) ||
    (user.email && u.email === user.email));

  const userToSave = {
    ...user,
    id: user.id || `user_${Date.now()}`,
    isVerified: true,
    createdAt: user.createdAt || new Date().toISOString()
  };

  let saved;
  if (existingIndex >= 0) {
    saved = { ...users[existingIndex], ...userToSave };
    users = users.map((u, i) => (i === existingIndex ? saved : u));
  } else {
    saved = userToSave;
    users = [...users, saved];
  }
  pushUser(saved);
  return saved;
};

export const authenticateUser = (phoneOrEmail, password, role) => {
  const found = users.find(u =>
    (u.phone === phoneOrEmail || u.email === phoneOrEmail || (u.phone && phoneOrEmail.includes(u.phone))) &&
    (!role || u.role === role)
  );
  return found || null;
};

// --- BOOKINGS OPERATIONS ---
export const getBookings = () => bookings;

const replaceBooking = (updated) => {
  bookings = bookings.map(b => (b.id === updated.id ? updated : b));
  pushBooking(updated);
  return updated;
};

export const addBooking = (booking) => {
  const newBooking = {
    ...booking,
    id: booking.id || `bk_${Date.now()}`,
    startOtp: booking.startOtp || Math.floor(1000 + Math.random() * 9000).toString(),
    status: booking.status || 'en_route',
    createdAt: new Date().toISOString()
  };
  if (sessionUser && !newBooking.customerPhone) {
    newBooking.customerPhone = sessionUser.phone;
    newBooking.customerName = sessionUser.name;
  }
  bookings = [newBooking, ...bookings];
  pushBooking(newBooking);
  return newBooking;
};

export const updateBookingStatus = (bookingId, status) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return null;
  const updated = { ...b, status };
  if (status === 'completed') {
    updated.completedAt = new Date().toISOString();
    updated.escrowLocked = false;
  }
  return replaceBooking(updated);
};

export const cancelBooking = (bookingId, reason = 'Customer requested cancellation', fee = 50) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return null;
  const notified = withNotice(b, 'worker', `${(b.customerName || 'The customer').split(' ')[0]} cancelled the booking for ${b.categoryName || 'the job'}.`, 'cancelled');
  return replaceBooking({
    ...notified,
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
    cancellationFee: fee,
    refundAmount: Math.max(0, (b.quoteAmount || 0) - fee),
    workerCompensated: true,
    workerCompensationAmount: fee,
    escrowLocked: false
  });
};

// --- NEGOTIATION & NOTIFICATIONS ---
// Offers and notifications live inside the booking row (bookings.data), so both the
// customer and the worker see them through the normal Supabase sync.
const withNotice = (b, to, text, type = 'info') => ({
  ...b,
  notifications: [
    ...(b.notifications || []),
    { id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, to, type, text, at: new Date().toISOString() }
  ]
});

const firstName = (name, fallback) => (name || fallback).split(' ')[0];

// Customer books a worker: the request goes to the worker as the first offer.
export const createBookingRequest = (booking) => {
  const amount = booking.quoteAmount;
  const now = new Date().toISOString();
  const base = {
    ...booking,
    status: 'negotiating',
    offers: [{ by: 'customer', amount, at: now }],
    lastOfferBy: 'customer',
    customerAgreed: false
  };
  const who = firstName(booking.customerName, 'A customer');
  return addBooking(withNotice(base, 'worker', `${who} booked you for ${booking.categoryName || 'a job'} at ₹${amount}. Accept or send your price.`, 'booked'));
};

// Either side proposes a new price.
export const proposePrice = (bookingId, by, amount) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b || !amount) return null;
  const updated = {
    ...b,
    quoteAmount: amount,
    offers: [...(b.offers || []), { by, amount, at: new Date().toISOString() }],
    lastOfferBy: by,
    customerAgreed: false
  };
  const text = by === 'worker'
    ? `${firstName(b.worker?.name, 'The worker')} sent a new price for ${b.categoryName || 'your job'}: ₹${amount}.`
    : `${firstName(b.customerName, 'The customer')} changed the offer for ${b.categoryName || 'the job'} to ₹${amount}.`;
  return replaceBooking(withNotice(updated, by === 'worker' ? 'customer' : 'worker', text, 'bid'));
};

// Customer agrees to the worker's price; the worker still confirms the order.
export const customerAgreePrice = (bookingId) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return null;
  return replaceBooking(withNotice({ ...b, customerAgreed: true }, 'worker',
    `${firstName(b.customerName, 'The customer')} agreed to ₹${b.quoteAmount} for ${b.categoryName || 'the job'}. Accept to confirm the order.`, 'bid'));
};

// Worker accepts the order at the current price.
export const workerAcceptBooking = (bookingId) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return null;
  const updated = {
    ...b,
    status: b.timingSlot?.type === 'scheduled' ? 'scheduled' : 'en_route',
    acceptedAt: new Date().toISOString(),
    customerAgreed: true
  };
  return replaceBooking(withNotice(updated, 'customer',
    `${firstName(b.worker?.name, 'Your worker')} accepted your order for ${b.categoryName || 'your job'} at ₹${b.quoteAmount}.`, 'accepted'));
};

// All notifications for one side, newest first. Each carries its booking id.
export const getNotifications = (to, filterBooking = () => true) =>
  bookings
    .filter(filterBooking)
    .flatMap(b => (b.notifications || []).filter(n => n.to === to).map(n => ({ ...n, bookingId: b.id })))
    .sort((a, b) => new Date(b.at) - new Date(a.at));

export const verifyBookingOtp = (bookingId, otpEntered) => {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return { success: false, error: 'Order not found in database.' };
  if (b.startOtp === otpEntered.trim()) {
    const updated = replaceBooking({
      ...b,
      status: 'in_progress',
      otpVerified: true,
      otpVerifiedAt: new Date().toISOString()
    });
    return { success: true, booking: updated };
  }
  return {
    success: false,
    error: `Incorrect OTP. Please ask the customer to check the 4-digit code on their KaamSetu screen (hint: ${b.startOtp}).`
  };
};

// Remember who is logged in so new bookings are tagged with the customer.
export const setSessionUser = (user) => {
  sessionUser = user || null;
  if (user) pushUser(user);
};

// --- CHAT ---
export const logChatMessage = (bookingId, sender, text) => {
  if (!bookingId || !text) return;
  insert('chat_messages', { booking_id: bookingId, sender, text }).catch(warn('chat save'));
};

// Save a chat message and wait for Supabase (used by the booking page chat)
export const sendChatMessage = async (bookingId, sender, text) => {
  if (!bookingId || !text) return;
  await insert('chat_messages', { booking_id: bookingId, sender, text });
};

export const getChatMessages = async (bookingId) => {
  if (!bookingId) return [];
  try {
    return await select(
      'chat_messages',
      `select=id,sender,text,created_at&booking_id=eq.${encodeURIComponent(bookingId)}&order=created_at.asc&limit=200`
    );
  } catch (e) {
    warn('chat load')(e);
    return [];
  }
};

// --- SUPABASE ROW MAPPING ---
const iso = (v) => (v ? new Date(v).toISOString() : null);

const userToRow = (u) => {
  const { password, ...safe } = u; // never send passwords to the database
  return {
    // one row per phone/email, so the same person on two devices doesn't create duplicates
    id: `user_${(u.phone || u.email).toString().toLowerCase().replace(/[^a-z0-9@.]/g, '')}`,
    role: u.role || 'customer',
    auth_user_id: u.authUserId || null, // link to the Supabase Auth account (auth.users)
    name: u.name || null,
    phone: u.phone || null,
    email: u.email || null,
    locality: u.locality || null,
    trade: u.trade || null,
    trade_label: u.tradeLabel || null,
    document_name: u.documentName || null,
    document_type: u.documentType || null,
    govt_id_document: u.govtIdDocument || null,
    police_clearance_document: u.policeClearanceDocument || null,
    is_verified: !!u.isVerified,
    is_govt_id_verified: !!u.isGovtIdVerified,
    is_police_clearance_verified: !!u.isPoliceClearanceVerified,
    avatar: u.avatar || null,
    created_at: iso(u.createdAt) || new Date().toISOString(),
    data: safe
  };
};

const bookingToRow = (b) => ({
  id: b.id,
  customer_phone: b.customerPhone || null,
  customer_name: b.customerName || null,
  category: b.category || null,
  category_name: b.categoryName || null,
  title: b.title || null,
  description: b.description || null,
  address: b.address || null,
  urgency: b.urgency || null,
  timing_type: b.timingSlot?.type || null,
  budget_min: b.budgetRange?.min ?? null,
  budget_max: b.budgetRange?.max ?? null,
  quote_amount: b.quoteAmount ?? null,
  status: b.status || 'en_route',
  worker_id: b.worker?.id != null ? String(b.worker.id) : null,
  worker_name: b.worker?.name || null,
  start_otp: b.startOtp || null,
  otp_verified: !!b.otpVerified,
  eta_mins: b.etaMins ?? null,
  distance_km: b.distanceKm ?? null,
  escrow_locked: b.escrowLocked !== false,
  cancellation_reason: b.cancellationReason || null,
  cancellation_fee: b.cancellationFee ?? null,
  refund_amount: b.refundAmount ?? null,
  created_at: iso(b.createdAt) || new Date().toISOString(),
  otp_verified_at: iso(b.otpVerifiedAt),
  completed_at: iso(b.completedAt),
  cancelled_at: iso(b.cancelledAt),
  data: b
});

const warn = (what) => (e) => console.warn(`[KaamSetu] Supabase ${what} failed:`, e.message);

function pushUser(u) {
  if (!u || !userKey(u)) return;
  unsyncedUsers.set(userKey(u), u);
  upsert('app_users', userToRow(u))
    .then(() => { if (unsyncedUsers.get(userKey(u)) === u) unsyncedUsers.delete(userKey(u)); })
    .catch(warn('user save (will retry)'));
}

function pushBooking(b) {
  if (!b || !b.id) return;
  unsyncedBookings.set(b.id, b);
  upsert('bookings', bookingToRow(b))
    .then(() => { if (unsyncedBookings.get(b.id) === b) unsyncedBookings.delete(b.id); })
    .catch(warn('booking save (will retry)'));
}

// --- LOADING FROM SUPABASE ---
const notify = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DB_SYNC_EVENT));
};

// Pull users + bookings. Supabase wins, except for local writes that haven't landed yet.
const pullCore = async () => {
  const [remoteBookings, remoteUsers] = await Promise.all([
    select('bookings', 'select=data&order=created_at.desc&limit=500'),
    select('app_users', 'select=data&limit=1000')
  ]);
  if (hasPendingWrites()) return false;

  // retry anything that failed to save earlier
  unsyncedBookings.forEach(pushBooking);
  unsyncedUsers.forEach(pushUser);

  const cloudB = remoteBookings.map(r => r.data).filter(Boolean);
  const pendingB = [...unsyncedBookings.values()];
  const pendingIds = new Set(pendingB.map(b => b.id));
  const nextB = [...pendingB, ...cloudB.filter(b => !pendingIds.has(b.id))].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  const cloudU = remoteUsers.map(r => r.data).filter(Boolean);
  const pendingU = [...unsyncedUsers.values()];
  const pendingKeys = new Set(pendingU.map(userKey));
  const nextU = [...cloudU.filter(u => !pendingKeys.has(userKey(u))), ...pendingU];

  const changed = JSON.stringify(nextB) !== JSON.stringify(bookings);
  bookings = nextB;
  users = nextU;
  if (changed) notify();
  return true;
};

// Workers and service categories: read from Supabase. If a table is still empty,
// it is filled once from the starter list so the site has something to show.
const loadCatalog = async (table, target) => {
  let rows;
  try {
    rows = await select(table, 'select=data&order=sort_order.asc');
  } catch (e) {
    // Table not created yet: keep the starter list until supabase/migration_v2.sql is run.
    if (/PGRST205|404|does not exist|Could not find/i.test(e.message)) {
      console.warn(`[KaamSetu] Supabase table "${table}" missing. Run supabase/migration_v2.sql.`);
      return;
    }
    throw e;
  }
  if (!rows.length && target.length) {
    await upsert(table, target.map((d, i) => ({ id: String(d.id), sort_order: i, data: d })));
    rows = await select(table, 'select=data&order=sort_order.asc');
  }
  // mutate in place: components import these arrays directly
  target.splice(0, target.length, ...rows.map(r => r.data).filter(Boolean));
};

let pollTimer = null;

// Called once before the app renders. Throws if Supabase can't be reached.
export const loadDatabase = async () => {
  await Promise.all([
    pullCore(),
    loadCatalog('workers', WORKERS_DATABASE),
    loadCatalog('service_categories', SERVICE_CATEGORIES)
  ]);
  if (!pollTimer && typeof window !== 'undefined') {
    pollTimer = setInterval(() => pullCore().catch(warn('sync')), 5000);
  }
};

// Load the profile that belongs to a Supabase Auth account.
export const findUserByAuthId = async (authUserId) => {
  if (!authUserId) return null;
  try {
    const rows = await select('app_users', `select=data&auth_user_id=eq.${encodeURIComponent(authUserId)}&limit=1`);
    if (rows && rows[0] && rows[0].data) return rows[0].data;
  } catch (e) {
    warn('profile load')(e);
  }
  return users.find(u => u.authUserId === authUserId) || null;
};
