// KaamSetu Persistent Database Service (Local Engine)
// Persists Users, Multiple Bookings, and Chat Threads across sessions

import { WORKERS_DATABASE } from '../data/mockData';
import { upsert, insert, select, hasPendingWrites } from './supabase';

const USERS_STORAGE_KEY = 'kaamsetu_db_users';
const BOOKINGS_STORAGE_KEY = 'kaamsetu_db_bookings';
const MESSAGES_STORAGE_KEY = 'kaamsetu_db_messages';

// Initial pre-seeded demo users with uploaded documents
const INITIAL_USERS = [
  {
    id: 'user_cust_1',
    role: 'customer',
    name: 'Priya Sharma',
    phone: '+91 98200 44102',
    email: 'priya.sharma@example.com',
    locality: 'Pali Hill, Bandra West, Mumbai',
    documentName: 'Aadhaar_Priya_Sharma.pdf',
    documentType: 'Aadhaar Card',
    documentUploadedAt: '2026-10-20T10:00:00.000Z',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'user_work_1',
    role: 'worker',
    name: 'Rajesh Kumar',
    phone: '+91 98201 44521',
    email: 'rajesh.plumber@example.com',
    locality: 'Lokhandwala, Andheri West, Mumbai',
    trade: 'Plumbing',
    tradeLabel: 'Senior Master Plumber',
    documentName: 'Govt_ID_NSDC_Rajesh.pdf',
    documentType: 'NSDC Skill Certificate + Aadhaar',
    documentUploadedAt: '2026-10-18T14:30:00.000Z',
    isVerified: true,
    password: '1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  }
];

// Initial pre-seeded multiple bookings for the customer
const INITIAL_BOOKINGS = [
  {
    id: 'bk_101',
    category: 'plumbing',
    categoryName: 'Plumbing',
    title: 'Kitchen Faucet Cartridge Leakage',
    description: 'Master bathroom diverter cartridge leaking into cabinet. Needs replacement.',
    address: 'Flat 402, Sea Green Apts, Pali Hill, Bandra West',
    urgency: 'Immediate (< 30 min)',
    timingSlot: {
      type: 'immediate',
      date: 'Today',
      timeSlot: 'Immediate (< 30 min)',
      exactTime: '18:45'
    },
    budgetRange: { min: 250, max: 450 },
    quoteAmount: 350,
    status: 'en_route', // 'bidding' | 'en_route' | 'scheduled' | 'in_progress' | 'completed'
    worker: WORKERS_DATABASE[0], // Rameshwar Jadhav
    startOtp: '4829',
    etaMins: 8,
    distanceKm: 1.2,
    escrowLocked: true,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'bk_102',
    category: 'electrical',
    categoryName: 'Electrical',
    title: 'Main Hall MCB Tripping Continuously',
    description: '32A breaker trips whenever the 1.5 ton split AC runs over 20 minutes.',
    address: 'Flat 402, Sea Green Apts, Pali Hill, Bandra West',
    urgency: 'Scheduled Slot',
    timingSlot: {
      type: 'scheduled',
      date: 'Tomorrow',
      timeSlot: 'Morning (10:00 AM - 12:00 PM)',
      exactTime: '10:30 AM'
    },
    budgetRange: { min: 350, max: 550 },
    quoteAmount: 420,
    status: 'scheduled',
    worker: WORKERS_DATABASE[2], // Farooq Ansari (Electrician)
    startOtp: '7194',
    etaMins: 45,
    distanceKm: 2.4,
    escrowLocked: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'bk_103',
    category: 'cleaning',
    categoryName: 'House Maid & Cleaning',
    title: 'Deep Kitchen Degreasing & Exhaust Fan',
    description: 'Heavy oil stains on wall tiles and chimney filter degreased with eco-friendly chemical.',
    address: 'Flat 402, Sea Green Apts, Pali Hill, Bandra West',
    urgency: 'Completed',
    timingSlot: {
      type: 'scheduled',
      date: 'Yesterday',
      timeSlot: 'Afternoon (02:00 PM - 04:00 PM)',
      exactTime: '02:15 PM'
    },
    budgetRange: { min: 400, max: 600 },
    quoteAmount: 500,
    status: 'completed',
    worker: WORKERS_DATABASE[1], // Sunita Devi Vishwakarma
    startOtp: '3921',
    etaMins: 0,
    distanceKm: 2.1,
    escrowLocked: false,
    completedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString()
  }
];

// --- USERS OPERATIONS ---
export const getUsers = () => {
  try {
    const raw = (localStorage.getItem(USERS_STORAGE_KEY) || localStorage.getItem('kaamwala_db_users'));
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS;
  }
};

export const saveUser = (user) => {
  try {
    const users = getUsers();
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

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userToSave };
    } else {
      users.push(userToSave);
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    pushUser(existingIndex >= 0 ? users[existingIndex] : userToSave);
    return userToSave;
  } catch (e) {
    console.error('Error saving user to DB:', e);
    return user;
  }
};

export const authenticateUser = (phoneOrEmail, password, role) => {
  const users = getUsers();
  const found = users.find(u => 
    (u.phone === phoneOrEmail || u.email === phoneOrEmail || phoneOrEmail.includes(u.phone)) &&
    (!role || u.role === role)
  );
  return found || null;
};

// --- BOOKINGS OPERATIONS (MULTIPLE BOOKINGS TRACKER) ---
export const getBookings = () => {
  try {
    const raw = (localStorage.getItem(BOOKINGS_STORAGE_KEY) || localStorage.getItem('kaamwala_db_bookings'));
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BOOKINGS;
  }
};

export const addBooking = (booking) => {
  try {
    const bookings = getBookings();
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
    bookings.unshift(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    pushBooking(newBooking);
    return newBooking;
  } catch (e) {
    console.error('Error adding booking to DB:', e);
    return booking;
  }
};

export const updateBookingStatus = (bookingId, status) => {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index >= 0) {
      bookings[index].status = status;
      if (status === 'completed') {
        bookings[index].completedAt = new Date().toISOString();
        bookings[index].escrowLocked = false;
      }
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
      pushBooking(bookings[index]);
      return bookings[index];
    }
    return null;
  } catch (e) {
    console.error('Error updating booking status:', e);
    return null;
  }
};

export const cancelBooking = (bookingId, reason = 'Customer requested cancellation', fee = 50) => {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index >= 0) {
      const b = bookings[index];
      b.status = 'cancelled';
      b.cancelledAt = new Date().toISOString();
      b.cancellationReason = reason;
      b.cancellationFee = fee;
      b.refundAmount = Math.max(0, (b.quoteAmount || 0) - fee);
      b.workerCompensated = true;
      b.workerCompensationAmount = fee;
      b.escrowLocked = false;
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
      pushBooking(b);
      return b;
    }
    return null;
  } catch (e) {
    console.error('Error cancelling booking:', e);
    return null;
  }
};

export const verifyBookingOtp = (bookingId, otpEntered) => {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index >= 0) {
      const b = bookings[index];
      if (b.startOtp === otpEntered.trim()) {
        b.status = 'in_progress';
        b.otpVerified = true;
        b.otpVerifiedAt = new Date().toISOString();
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
        pushBooking(b);
        return { success: true, booking: b };
      } else {
        return { 
          success: false, 
          error: `Incorrect OTP. Please ask the customer to check the 4-digit code on their KaamSetu screen (hint: ${b.startOtp}).` 
        };
      }
    }
    return { success: false, error: 'Order not found in database.' };
  } catch (e) {
    console.error('Error verifying OTP:', e);
    return { success: false, error: e.message };
  }
};

// --- SUPABASE CLOUD SYNC ---
// localStorage stays the fast synchronous cache the UI reads from; every write is
// mirrored to Supabase, and syncFromCloud() pulls the shared data back down so
// bookings made on one device show up on others (e.g. customer -> worker portal).

export const DB_SYNC_EVENT = 'kaamsetu-db-sync';
let sessionUser = null;

// Remember who is logged in so new bookings are tagged with the customer.
export const setSessionUser = (user) => {
  sessionUser = user || null;
  if (user) pushUser(user);
};

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

const warn = (what) => (e) => console.warn(`[KaamSetu] Supabase ${what} failed (kept locally):`, e.message);

function pushUser(u) {
  if (!u || (!u.phone && !u.email)) return;
  const row = userToRow(u);
  upsert('app_users', row).catch((e) => {
    // Database not updated yet (auth_user_id column missing): save the profile without the link.
    if (/auth_user_id/.test(e.message)) {
      console.warn('[KaamSetu] Run the latest supabase/migration.sql to link profiles to accounts.');
      const { auth_user_id, ...rest } = row;
      return upsert('app_users', rest).catch(warn('user save'));
    }
    warn('user save')(e);
  });
}

function pushBooking(b) {
  if (!b || !b.id) return;
  upsert('bookings', bookingToRow(b)).catch(warn('booking save'));
}

export const logChatMessage = (bookingId, sender, text) => {
  if (!bookingId || !text) return;
  insert('chat_messages', { booking_id: bookingId, sender, text }).catch(warn('chat log'));
};

// Merge cloud rows into the local cache. Cloud wins for shared ids; local-only
// rows (e.g. demo seeds on first run) are pushed up.
export const syncFromCloud = async () => {
  if (hasPendingWrites()) return false; // don't overwrite a write still in flight
  try {
    const [remoteBookings, remoteUsers] = await Promise.all([
      select('bookings', 'select=data&order=created_at.desc&limit=500'),
      select('app_users', 'select=data&limit=1000')
    ]);
    if (hasPendingWrites()) return false;

    const localBookings = getBookings();
    const cloudB = remoteBookings.map(r => r.data).filter(Boolean);
    const cloudIds = new Set(cloudB.map(b => b.id));
    const localOnly = localBookings.filter(b => !cloudIds.has(b.id));
    localOnly.forEach(pushBooking);
    const mergedB = [...cloudB, ...localOnly].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    const localUsers = getUsers();
    const cloudU = remoteUsers.map(r => r.data).filter(Boolean);
    const key = (u) => u.phone || u.email;
    const cloudKeys = new Set(cloudU.map(key));
    const localUOnly = localUsers.filter(u => !cloudKeys.has(key(u)));
    localUOnly.forEach(pushUser);
    // keep local-only fields such as demo passwords
    const mergedU = [
      ...cloudU.map(cu => ({ ...(localUsers.find(lu => key(lu) === key(cu)) || {}), ...cu })),
      ...localUOnly
    ];

    const changed = JSON.stringify(mergedB) !== JSON.stringify(localBookings);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(mergedB));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mergedU));
    if (changed && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DB_SYNC_EVENT));
    }
    return true;
  } catch (e) {
    warn('sync')(e);
    return false;
  }
};

// Pull on load and every few seconds so other devices' changes appear.
if (typeof window !== 'undefined') {
  syncFromCloud();
  setInterval(syncFromCloud, 5000);
}

// Load the profile that belongs to a Supabase Auth account (cloud first, then local cache).
export const findUserByAuthId = async (authUserId) => {
  if (!authUserId) return null;
  try {
    const rows = await select('app_users', `select=data&auth_user_id=eq.${encodeURIComponent(authUserId)}&limit=1`);
    if (rows && rows[0] && rows[0].data) return rows[0].data;
  } catch (e) {
    warn('profile load')(e);
  }
  return getUsers().find(u => u.authUserId === authUserId) || null;
};
