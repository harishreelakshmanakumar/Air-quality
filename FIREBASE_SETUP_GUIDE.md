# Firebase + ESP32 Sensor Integration Guide

Complete setup guide for integrating ESP32 sensors with Firebase Realtime Database and displaying live data in your Next.js dashboard.

---

## Table of Contents

1. [Firebase Project Setup](#1-firebase-project-setup)
2. [Firebase Database Configuration](#2-firebase-database-configuration)
3. [Next.js Environment Setup](#3-nextjs-environment-setup)
4. [ESP32 Hardware Setup](#4-esp32-hardware-setup)
5. [ESP32 Code Configuration](#5-esp32-code-configuration)
6. [Testing & Verification](#6-testing--verification)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Firebase Project Setup

### Step 1.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., `hotel-environmental-monitoring`)
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

### Step 1.2: Get Firebase Credentials

1. In your Firebase project, click the **gear icon** ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app with a nickname (e.g., `Next.js Dashboard`)
5. Copy the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## 2. Firebase Database Configuration

### Step 2.1: Enable Realtime Database

1. In Firebase Console, go to **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Select location (choose closest to your region)
4. Start in **"Test mode"** for now (we'll secure it later)

### Step 2.2: Set Database Rules

For development, use these rules (⚠️ **NOT for production**):

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

For production, use these secure rules:

```json
{
  "rules": {
    "sensors": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null || request.auth.uid != null"
      }
    }
  }
}
```

1. Click **"Rules"** tab in Realtime Database
2. Paste the appropriate rules
3. Click **"Publish"**

### Step 2.3: Database Structure

Your database will automatically organize data like this:

```
sensors/
  ├── r1/
  │   ├── latest/
  │   │   ├── roomId: "r1"
  │   │   ├── timestamp: 1234567890
  │   │   └── airQuality/
  │   │       ├── pm25: 12.5
  │   │       ├── pm10: 25.3
  │   │       ├── co2: 650
  │   │       ├── co: 0.8
  │   │       ├── voc: 120
  │   │       ├── nox: 15.2
  │   │       ├── sox: 5.4
  │   │       └── aqi: 45
  │   ├── 1234567890/  (timestamped history)
  │   ├── 1234567900/
  │   └── ...
  ├── r2/
  ├── r3/
  └── r4/
```

---

## 3. Next.js Environment Setup

### Step 3.1: Create .env.local File

1. In your project root (`d:\Hari\Hari\`), create a file named `.env.local`
2. Copy the template from `.env.local.example`
3. Fill in your Firebase credentials from Step 1.2:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

⚠️ **Important**: `.env.local` is already in `.gitignore` - never commit this file!

### Step 3.2: Test Firebase Connection

1. Start your Next.js dev server:
   ```powershell
   cd d:\Hari\Hari
   npm run dev
   ```

2. Navigate to any room's metrics page:
   ```
   http://localhost:3000/room/r1/metrics
   ```

3. Open browser console (F12) to check for Firebase connection logs

---

## 4. ESP32 Hardware Setup

### Step 4.1: Required Components

**Microcontroller:**
- ESP32 Development Board (or ESP8266)
- USB cable for programming

**Air Quality Sensors (examples):**
- **PM2.5/PM10**: PMS5003, SDS011, or GP2Y1010AU
- **CO2**: MH-Z19B, SCD30, or CCS811
- **CO**: MQ-7 or MQ-9
- **VOC**: CCS811, BME680, or SGP30
- **NOx**: MICS-2714 or similar
- **SOx**: MICS-2610 or similar

**Other Components:**
- Breadboard
- Jumper wires
- 5V power supply (if sensors need external power)

### Step 4.2: Wiring Diagram

Connect sensors to ESP32 analog pins:

```
ESP32 Pin    →    Sensor
─────────────────────────────
GPIO 34 (ADC1_6)  →  PM2.5 Analog Out
GPIO 35 (ADC1_7)  →  PM10 Analog Out
GPIO 32 (ADC1_4)  →  CO2 Analog Out
GPIO 33 (ADC1_5)  →  CO Analog Out
GPIO 25 (ADC2_8)  →  VOC Analog Out
GPIO 26 (ADC2_9)  →  NOx Analog Out
GPIO 27 (ADC2_7)  →  SOx Analog Out

3.3V  →  Sensor VCC (check sensor voltage requirements!)
GND   →  Sensor GND
```

⚠️ **Important Notes:**
- ESP32 ADC pins support 0-3.3V input (NOT 5V!)
- Use voltage dividers if sensors output 5V
- Some sensors (like MH-Z19B) use UART - adjust code accordingly
- Check each sensor's datasheet for proper wiring

### Step 4.3: Sensor Libraries

Some sensors require specific libraries:

**For PMS5003 (PM2.5/PM10):**
```cpp
#include <PMS.h>
PMS pms(Serial2);  // Use hardware serial
```

**For MH-Z19B (CO2):**
```cpp
#include <MHZ19.h>
MHZ19 myMHZ19;
```

**For CCS811 (VOC/CO2):**
```cpp
#include <Adafruit_CCS811.h>
Adafruit_CCS811 ccs;
```

Install these via Arduino Library Manager if needed.

---

## 5. ESP32 Code Configuration

### Step 5.1: Install Arduino IDE & Libraries

1. Download [Arduino IDE](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - Go to **File** → **Preferences**
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools** → **Board** → **Boards Manager**
   - Search "ESP32" and install "ESP32 by Espressif Systems"

3. Install Firebase ESP Client library:
   - Go to **Sketch** → **Include Library** → **Manage Libraries**
   - Search "Firebase ESP Client"
   - Install **"Firebase ESP Client" by Mobizt** (v4.x.x)

### Step 5.2: Configure ESP32_Firebase_Sensor.ino

1. Open `ESP32_Firebase_Sensor.ino` in Arduino IDE
2. Update WiFi credentials (lines 24-25):

```cpp
#define WIFI_SSID "Your_WiFi_SSID"        // Your WiFi network name
#define WIFI_PASSWORD "Your_WiFi_Password" // Your WiFi password
```

3. Update Firebase configuration (lines 27-29):

```cpp
#define FIREBASE_API_KEY "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
#define FIREBASE_DATABASE_URL "https://your-project-default-rtdb.firebaseio.com"
```

4. Set your room ID (line 31):

```cpp
#define ROOM_ID "r1"  // Change to r2, r3, or r4 for other rooms
```

5. Verify sensor pin assignments (lines 34-40) match your wiring

### Step 5.3: Upload Code to ESP32

1. Connect ESP32 to computer via USB
2. In Arduino IDE:
   - **Tools** → **Board** → **ESP32 Dev Module**
   - **Tools** → **Port** → Select your ESP32's COM port
   - **Tools** → **Upload Speed** → **115200**
3. Click **Upload** button (→)
4. Wait for compilation and upload to complete

### Step 5.4: Monitor Serial Output

1. Open **Tools** → **Serial Monitor**
2. Set baud rate to **115200**
3. You should see:

```
=================================
ESP32 Firebase Sensor Starting...
=================================
Connecting to WiFi...
Connected! IP: 192.168.1.100
Signing in to Firebase...
Firebase Ready!
Starting sensor readings...

──────────────────────────────────
Room: r1 | Time: 5000
Air Quality Readings:
  PM2.5: 12.34 µg/m³
  PM10:  25.67 µg/m³
  CO2:   650 ppm
  CO:    0.85 ppm
  VOC:   120 ppb
  NOx:   15.20 ppb
  SOx:   5.40 ppb
  AQI:   45
Sending to Firebase (history): sensors/r1/5000
✓ History data sent successfully
Updating latest reading: sensors/r1/latest
✓ Latest data updated successfully
──────────────────────────────────
```

---

## 6. Testing & Verification

### Step 6.1: Verify Firebase Data

1. Go to Firebase Console → Realtime Database
2. You should see data structure under `sensors/r1/`
3. Check that `latest` node updates every 5 seconds
4. Verify timestamped history nodes are being created

### Step 6.2: Test Dashboard Display

1. Open your Next.js dashboard:
   ```
   http://localhost:3000/room/r1/metrics
   ```

2. **Look for these indicators:**
   - 🟢 **"Live from Cloud (Firebase)"** banner at top
   - Green status indicator showing "Receiving data"
   - Live gauges showing sensor values
   - Gauges should update every 5 seconds

3. **Open browser console (F12):**
   - Should see: `"Cloud data received for r1"`
   - Should NOT see errors about Firebase connection

### Step 6.3: Test Multiple Rooms

To monitor multiple rooms:

1. Deploy additional ESP32 boards with different `ROOM_ID` values:
   - ESP32 #1: `ROOM_ID "r1"`
   - ESP32 #2: `ROOM_ID "r2"`
   - ESP32 #3: `ROOM_ID "r3"`
   - ESP32 #4: `ROOM_ID "r4"`

2. Each ESP32 will write to its own path: `sensors/r1/`, `sensors/r2/`, etc.

3. Navigate to different room pages to see their respective data

---

## 7. Troubleshooting

### Issue: ESP32 Can't Connect to WiFi

**Symptoms:**
- Serial monitor shows "Connecting to WiFi..." indefinitely
- No IP address displayed

**Solutions:**
1. Double-check WiFi SSID and password (case-sensitive!)
2. Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
3. Move ESP32 closer to router
4. Check if WiFi has MAC address filtering enabled

---

### Issue: Firebase Connection Failed

**Symptoms:**
- Serial monitor shows "Failed to send data"
- Error: "401 Unauthorized" or "Permission denied"

**Solutions:**
1. Verify `FIREBASE_API_KEY` is correct in ESP32 code
2. Check `FIREBASE_DATABASE_URL` format (must include `https://` and `.firebaseio.com`)
3. Ensure database rules allow writes (see Step 2.2)
4. Try regenerating API key in Firebase Console

---

### Issue: Dashboard Shows No Data

**Symptoms:**
- Dashboard displays "🔴 No data from cloud"
- Gauges show static values from JSON file

**Solutions:**
1. Verify `.env.local` exists and has correct Firebase credentials
2. Restart Next.js dev server after creating `.env.local`:
   ```powershell
   # Press Ctrl+C to stop, then:
   npm run dev
   ```
3. Check browser console for Firebase errors
4. Verify Firebase database has data (Firebase Console)
5. Ensure ESP32 is running and sending data (check Serial Monitor)

---

### Issue: Gauges Not Updating

**Symptoms:**
- Dashboard shows cloud banner but gauges don't change
- Data is in Firebase but not displaying

**Solutions:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Check network tab (F12) for API errors
4. Verify API routes are running (should see `/api/sensors/r1` requests)
5. Check that `displayData` state is updating (add console.log)

---

### Issue: Sensor Readings Are Incorrect

**Symptoms:**
- Values are always 0 or max value
- Values don't change or are unrealistic

**Solutions:**
1. **Check wiring:**
   - Verify all connections are secure
   - Ensure correct pin assignments
   - Check sensor power requirements (3.3V vs 5V)

2. **Calibrate sensors:**
   - Most sensors need warm-up time (1-5 minutes)
   - Adjust calibration formulas in code
   - Example for PM2.5:
     ```cpp
     float pm25 = (rawValue / 4095.0) * 50.0;  // Adjust multiplier
     ```

3. **Use sensor-specific libraries:**
   - Replace analog reads with proper sensor libraries
   - See Step 4.3 for examples

---

### Issue: Firebase Quota Exceeded

**Symptoms:**
- Error: "Quota exceeded"
- Data stops sending after some time

**Solutions:**
1. **Increase update interval:**
   ```cpp
   #define UPDATE_INTERVAL 10000  // 10 seconds instead of 5
   ```

2. **Limit history storage:**
   - Use Firebase Database rules to auto-delete old data
   - Store only last 1000 readings per room

3. **Upgrade Firebase plan:**
   - Free tier: 1GB storage, 10GB/month bandwidth
   - Paid plans: More storage and bandwidth

---

### Issue: npm Audit Vulnerabilities

**Symptoms:**
- After running `npm install firebase`, you see:
  ```
  3 high severity vulnerabilities
  ```

**Solutions:**
1. **Check if vulnerabilities are in dev dependencies:**
   ```powershell
   npm audit
   ```

2. **Update packages:**
   ```powershell
   npm audit fix
   ```

3. **If issues persist:**
   - These are often in transitive dependencies
   - For production, use `npm audit --production` to see actual risks
   - Firebase SDK is actively maintained and safe to use

---

## Additional Resources

- **Firebase Documentation**: https://firebase.google.com/docs/database
- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/
- **Firebase ESP Client Library**: https://github.com/mobizt/Firebase-ESP-Client
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

## Security Recommendations for Production

Before deploying to production:

1. **Secure Firebase Database Rules:**
   ```json
   {
     "rules": {
       "sensors": {
         "$roomId": {
           ".read": true,
           ".write": "auth.uid != null"
         }
       }
     }
   }
   ```

2. **Use Firebase Authentication:**
   - Implement email/password auth or service accounts
   - Update ESP32 code to authenticate before writing

3. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Use Vercel/Netlify environment settings for deployment

4. **Rate Limiting:**
   - Implement rate limiting on API routes
   - Use Firebase Security Rules to limit write frequency

---

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review ESP32 Serial Monitor output
3. Check browser console (F12) for errors
4. Verify all configuration steps were followed

**Happy Monitoring! 🌱💨💧**
