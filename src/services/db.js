// KaamSetu Persistent Database Service (Local Engine)
// Persists Users, Multiple Bookings, and Chat Threads across sessions

import { WORKERS_DATABASE } from '../data/mockData';

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
    const existingIndex = users.findIndex(u => u.phone === user.phone || (u.email && u.email === user.email));
    
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

    bookings.unshift(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
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
