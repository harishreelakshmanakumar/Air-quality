# Quick Start Guide - Firebase Sensor Integration

Fast setup for getting your environmental monitoring system running with Firebase and ESP32.

---

## 🚀 Quick Setup (15 minutes)

### 1. Firebase Project (5 min)

1. Go to https://console.firebase.google.com/
2. Create new project → Enable Realtime Database
3. Copy credentials from Project Settings → Web app

### 2. Next.js Configuration (2 min)

Create `d:\Hari\Hari\.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

Restart dev server:
```powershell
npm run dev
```

### 3. Firebase Database Rules (1 min)

In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": true
    }
  }
}
```

Click **Publish**.

### 4. ESP32 Setup (7 min)

1. Open `ESP32_Firebase_Sensor.ino` in Arduino IDE
2. Update these lines:
   ```cpp
   #define WIFI_SSID "Your_WiFi_Name"
   #define WIFI_PASSWORD "Your_WiFi_Password"
   #define FIREBASE_API_KEY "your_api_key_here"
   #define FIREBASE_DATABASE_URL "https://your-project-default-rtdb.firebaseio.com"
   #define ROOM_ID "r1"  // r1, r2, r3, or r4
   ```
3. Upload to ESP32
4. Open Serial Monitor (115200 baud)

---

## ✅ Verification

### ESP32 Serial Monitor
You should see:
```
✓ History data sent successfully
✓ Latest data updated successfully
```

### Firebase Console
Check Realtime Database for:
```
sensors/
  └── r1/
      └── latest/
          └── airQuality/
```

### Next.js Dashboard
Open http://localhost:3000/room/r1/metrics

Look for:
- 🟢 **"Live from Cloud (Firebase)"** banner
- Gauges updating every 5 seconds

---

## 📁 File Overview

| File | Purpose |
|------|---------|
| `lib/firebase.ts` | Firebase SDK initialization + helpers |
| `app/api/sensors/[roomId]/route.ts` | GET latest sensor data |
| `app/api/sensors/history/[roomId]/route.ts` | GET historical data |
| `app/room/[roomId]/metrics/page.tsx` | Live dashboard with gauges |
| `ESP32_Firebase_Sensor.ino` | ESP32 firmware |
| `.env.local` | Firebase credentials (don't commit!) |

---

## 🔧 Common Issues

**Dashboard shows no data?**
- Restart Next.js after creating `.env.local`
- Check ESP32 Serial Monitor for "✓ sent successfully"

**ESP32 won't connect to WiFi?**
- Use 2.4GHz WiFi (not 5GHz)
- Double-check SSID/password (case-sensitive)

**Firebase permission denied?**
- Check database rules are published
- Verify API key is correct

---

## 📊 Data Flow

```
ESP32 Sensors
    ↓ (WiFi)
Firebase Realtime Database
    ↓ (API)
Next.js Dashboard
    ↓ (Live Gauges)
User
```

**Update Frequency:**
- ESP32 → Firebase: Every 5 seconds
- Dashboard refresh: Every 5 seconds

---

## 🎯 Next Steps

1. **Deploy multiple sensors**: Change `ROOM_ID` for each ESP32 (r1, r2, r3, r4)
2. **Add real sensors**: Replace analog reads with sensor libraries
3. **Secure production**: Update Firebase rules to require authentication
4. **Deploy to cloud**: Use Vercel/Netlify with environment variables

---

For detailed setup, see **FIREBASE_SETUP_GUIDE.md**.

For troubleshooting, check **FIREBASE_SETUP_GUIDE.md** → Section 7.

**Happy Monitoring! 🌱💨💧**
