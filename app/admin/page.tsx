'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { bookingService, BookingData } from '@/lib/firebase';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // Check if Firebase is configured
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'YOUR_PROJECT_ID') {
        const data = await bookingService.getAllBookings();
        setBookings(data);
      } else {
        // Show mock data if Firebase not configured
        console.log('Firebase not configured - showing demo data');
        setBookings([
          {
            id: 'demo1',
            bookingId: 'BK1732019234567',
            name: 'Hari Kumar',
            email: 'hari@example.com',
            phone: '+91 98765 43210',
            checkIn: '2025-11-25',
            checkOut: '2025-11-27',
            guests: 2,
            roomId: 'r1',
            roomName: 'Kongu TBI',
            roomPrice: 1800,
            hotelName: 'Kongu Engineering College',
            paymentMethod: 'UPI',
            totalPrice: 3600,
            status: 'confirmed',
            createdAt: { toDate: () => new Date() } as any,
          },
          {
            id: 'demo2',
            bookingId: 'BK1732019876543',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 87654 32109',
            checkIn: '2025-11-22',
            checkOut: '2025-11-24',
            guests: 1,
            roomId: 'r2',
            roomName: 'Riverfront Suite',
            roomPrice: 2200,
            hotelName: 'Thrisha Residence',
            paymentMethod: 'Card',
            totalPrice: 4400,
            status: 'confirmed',
            createdAt: { toDate: () => new Date(Date.now() - 86400000) } as any,
          },
        ] as any);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage all hotel bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-8">
          <div className="card bg-white">
            <p className="text-sm text-slate-600">Total Bookings</p>
            <p className="text-3xl font-bold text-primary mt-1">{stats.total}</p>
          </div>
          <div className="card bg-white">
            <p className="text-sm text-slate-600">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
          </div>
          <div className="card bg-white">
            <p className="text-sm text-slate-600">Completed</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.completed}</p>
          </div>
          <div className="card bg-white">
            <p className="text-sm text-slate-600">Total Revenue</p>
            <p className="text-3xl font-bold text-primary mt-1">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-white mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'confirmed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card bg-white overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-600 font-medium">No bookings found</p>
              <p className="text-slate-500 text-sm mt-1">
                {searchTerm ? 'Try a different search term' : 'Bookings will appear here once customers make reservations'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Booking ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Hotel & Room</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check-in</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check-out</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm font-mono font-semibold text-primary">{booking.bookingId}</p>
                        <p className="text-xs text-slate-500">
                          {booking.createdAt?.toDate ? new Date(booking.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">{booking.name}</p>
                        <p className="text-xs text-slate-500">{booking.email}</p>
                        <p className="text-xs text-slate-500">{booking.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">{booking.hotelName}</p>
                        <p className="text-xs text-slate-500">{booking.roomName}</p>
                        <p className="text-xs text-slate-500">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-900">{new Date(booking.checkIn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-900">{new Date(booking.checkOut).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {booking.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-slate-900">₹{booking.totalPrice?.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {!loading && filteredBookings.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        )}
      </main>
    </div>
  );
}
