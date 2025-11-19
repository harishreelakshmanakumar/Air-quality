import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get, query, orderByChild, limitToLast } from 'firebase/database';
import { getFirestore, collection, addDoc, getDocs, query as firestoreQuery, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';

// Firebase configuration
// Get these from: https://console.firebase.google.com/
// Project Settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://YOUR_PROJECT.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const firestore = getFirestore(app);

// Type definitions
export type SensorData = {
  roomId: string;
  timestamp: string;
  airQuality: {
    pm25: number;
    pm10: number;
    sox: number;
    nox: number;
    voc: number;
    co: number;
    co2: number;
    aqi: number;
  };
  waterQuality?: {
    tds: number;
    turbidity: number;
    ph: number;
    dissolvedOxygen: number;
  };
  temperature?: number;
  humidity?: number;
};

// Helper functions
export const firebase = {
  // Write sensor data to Firebase
  async writeSensorData(data: SensorData) {
    const { roomId, timestamp } = data;
    const sensorRef = ref(database, `sensors/${roomId}/${timestamp}`);
    await set(sensorRef, data);
    
    // Also update latest reading for quick access
    const latestRef = ref(database, `sensors/${roomId}/latest`);
    await set(latestRef, data);
    
    return data;
  },

  // Get latest sensor reading for a room
  async getLatestReading(roomId: string): Promise<SensorData | null> {
    const latestRef = ref(database, `sensors/${roomId}/latest`);
    const snapshot = await get(latestRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as SensorData;
    }
    return null;
  },

  // Get recent readings (last N entries)
  async getRecentReadings(roomId: string, limit: number = 50): Promise<SensorData[]> {
    const sensorRef = ref(database, `sensors/${roomId}`);
    const recentQuery = query(sensorRef, orderByChild('timestamp'), limitToLast(limit));
    const snapshot = await get(recentQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .filter(key => key !== 'latest')
        .map(key => data[key] as SensorData)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [];
  },

  // Get all rooms with sensor data
  async getAllRooms(): Promise<string[]> {
    const sensorsRef = ref(database, 'sensors');
    const snapshot = await get(sensorsRef);
    
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    return [];
  },

  // Check if sensor is online (updated within last 5 minutes)
  async getSensorStatus(roomId: string): Promise<{status: 'online' | 'warning' | 'offline', lastUpdate: string | null, minutesAgo: number}> {
    const latest = await this.getLatestReading(roomId);
    
    if (!latest || !latest.timestamp) {
      return { status: 'offline', lastUpdate: null, minutesAgo: 0 };
    }
    
    const lastUpdate = new Date(latest.timestamp);
    const minutesAgo = (Date.now() - lastUpdate.getTime()) / 1000 / 60;
    
    let status: 'online' | 'warning' | 'offline' = 'offline';
    if (minutesAgo < 5) status = 'online';
    else if (minutesAgo < 15) status = 'warning';
    
    return {
      status,
      lastUpdate: latest.timestamp,
      minutesAgo: Math.round(minutesAgo),
    };
  },
};

// ==================== FIRESTORE BOOKING FUNCTIONS ====================

export type BookingData = {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  roomName: string;
  roomPrice: number;
  hotelName: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: Timestamp;
  status: 'confirmed' | 'cancelled' | 'completed';
};

export const bookingService = {
  /**
   * Save a new booking to Firestore
   */
  async saveBooking(bookingData: Omit<BookingData, 'createdAt' | 'status'>): Promise<string> {
    try {
      const bookingsCollection = collection(firestore, 'bookings');
      const docRef = await addDoc(bookingsCollection, {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'confirmed',
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings ordered by creation date
   */
  async getAllBookings(): Promise<BookingData[]> {
    try {
      const bookingsCollection = collection(firestore, 'bookings');
      const q = firestoreQuery(bookingsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  /**
   * Get a single booking by ID
   */
  async getBookingById(bookingId: string): Promise<BookingData | null> {
    try {
      const bookingDoc = doc(firestore, 'bookings', bookingId);
      const docSnap = await getDoc(bookingDoc);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as any;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  },
};

export { app, database, firestore };

