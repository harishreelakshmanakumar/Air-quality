'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/lib/firebase";

type Props = {
  roomId: string;
  roomName: string;
  roomPrice: number;
  hotelName: string;
};

export default function BookingForm({ roomId, roomName, roomPrice, hotelName }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePayment = async (method: string) => {
    setProcessing(true);
    
    const nights = calculateNights();
    const totalPrice = nights * roomPrice;
    
    const bookingData = {
      ...formData,
      roomName,
      roomPrice,
      hotelName,
      roomId,
      paymentMethod: method,
      bookingId: `BK${Date.now()}`,
      totalPrice,
    };

    // Store booking data in sessionStorage for success page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Save booking to Firestore (only if Firebase is configured)
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'YOUR_PROJECT_ID') {
      try {
        await bookingService.saveBooking(bookingData);
        console.log('Booking saved to Firebase');
      } catch (error) {
        console.error('Error saving booking to Firebase:', error);
      }
    }

    // Send confirmation email (don't block navigation)
    fetch('/api/send-booking-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    }).then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log('Booking confirmation email sent successfully');
        } else {
          console.error('Failed to send email:', result.message);
        }
      })
      .catch(error => {
        console.error('Email API error:', error);
      });

    // Navigate immediately
    router.push('/booking/success');
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const totalPrice = calculateNights() * roomPrice;

  if (showPayment) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Select Payment Method</h3>
        
        {processing && (
          <div className="mb-4 p-4 bg-primary/10 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-primary font-medium">Processing your booking...</p>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Booking Summary</p>
            <p className="font-semibold text-slate-800">{roomName} - {hotelName}</p>
            <p className="text-sm text-slate-600 mt-1">
              {formData.checkIn} to {formData.checkOut} ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''})
            </p>
            <p className="text-2xl font-bold text-primary mt-2">₹{totalPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePayment('UPI')}
            disabled={processing}
            className="w-full p-4 border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary group-hover:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 group-hover:text-white">UPI Payment</p>
                <p className="text-sm text-slate-600 group-hover:text-white/90">Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => handlePayment('Card')}
            disabled={processing}
            className="w-full p-4 border-2 border-slate-300 rounded-xl hover:border-primary hover:bg-slate-50 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Credit/Debit Card</p>
                <p className="text-sm text-slate-600">Visa, Mastercard, RuPay</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => handlePayment('Net Banking')}
            disabled={processing}
            className="w-full p-4 border-2 border-slate-300 rounded-xl hover:border-primary hover:bg-slate-50 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7H4z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Net Banking</p>
                <p className="text-sm text-slate-600">All major banks supported</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setShowPayment(false)}
          className="w-full mt-4 py-3 text-slate-600 hover:text-slate-800 font-medium"
        >
          ← Back to booking details
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Book Your Stay</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
            <input
              type="date"
              required
              value={formData.checkIn}
              onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
            <input
              type="date"
              required
              value={formData.checkOut}
              onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
          <select
            value={formData.guests}
            onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {calculateNights() > 0 && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Total ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''})</span>
              <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
