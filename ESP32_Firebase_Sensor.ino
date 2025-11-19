/*
 * ESP32 Air Quality Sensor with Firebase Integration
 * 
 * This code reads air quality sensors and pushes data to Firebase Realtime Database
 * Compatible with: ESP32, ESP8266
 * 
 * Required Libraries:
 * - Firebase ESP Client by Mobizt (v4.x.x)
 * - WiFi (built-in)
 * 
 * Install via Arduino Library Manager:
 * Sketch -> Include Library -> Manage Libraries -> Search "Firebase ESP Client"
 */

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

// ==================== CONFIGURATION ====================

// WiFi Credentials
#define WIFI_SSID "Your_WiFi_SSID"
#define WIFI_PASSWORD "Your_WiFi_Password"

// Firebase Project Configuration
#define FIREBASE_API_KEY "Your_Firebase_API_Key"
#define FIREBASE_DATABASE_URL "https://your-project.firebaseio.com"

// Room Identifier (matches your Next.js room IDs: r1, r2, r3, r4)
#define ROOM_ID "r1"

// Sensor Pins (adjust based on your wiring)
#define PM25_SENSOR_PIN 34    // Analog pin for PM2.5 sensor
#define PM10_SENSOR_PIN 35    // Analog pin for PM10 sensor
#define CO2_SENSOR_PIN 32     // Analog pin for CO2 sensor
#define CO_SENSOR_PIN 33      // Analog pin for CO sensor
#define VOC_SENSOR_PIN 25     // Analog pin for VOC sensor
#define NOX_SENSOR_PIN 26     // Analog pin for NOx sensor
#define SOX_SENSOR_PIN 27     // Analog pin for SOx sensor

// Update Interval (milliseconds)
#define UPDATE_INTERVAL 5000  // Send data every 5 seconds

// ==================== GLOBAL OBJECTS ====================

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool firebaseReady = false;

// ==================== SENSOR READING FUNCTIONS ====================

/**
 * Read PM2.5 sensor value (µg/m³)
 * Replace with actual sensor library calls for real sensors
 */
float readPM25() {
  int rawValue = analogRead(PM25_SENSOR_PIN);
  // Convert analog reading to µg/m³ (adjust calibration as needed)
  float pm25 = (rawValue / 4095.0) * 50.0;  // 0-50 µg/m³ range
  
  // Add some realistic variation for testing
  pm25 += random(-5, 5) / 10.0;
  return constrain(pm25, 0, 50);
}

/**
 * Read PM10 sensor value (µg/m³)
 */
float readPM10() {
  int rawValue = analogRead(PM10_SENSOR_PIN);
  float pm10 = (rawValue / 4095.0) * 100.0;  // 0-100 µg/m³ range
  pm10 += random(-10, 10) / 10.0;
  return constrain(pm10, 0, 100);
}

/**
 * Read CO2 sensor value (ppm)
 */
float readCO2() {
  int rawValue = analogRead(CO2_SENSOR_PIN);
  float co2 = 400 + (rawValue / 4095.0) * 600.0;  // 400-1000 ppm range
  co2 += random(-20, 20);
  return constrain(co2, 400, 1000);
}

/**
 * Read CO sensor value (ppm)
 */
float readCO() {
  int rawValue = analogRead(CO_SENSOR_PIN);
  float co = (rawValue / 4095.0) * 5.0;  // 0-5 ppm range
  co += random(-10, 10) / 100.0;
  return constrain(co, 0, 5);
}

/**
 * Read VOC sensor value (ppb)
 */
float readVOC() {
  int rawValue = analogRead(VOC_SENSOR_PIN);
  float voc = (rawValue / 4095.0) * 500.0;  // 0-500 ppb range
  voc += random(-20, 20);
  return constrain(voc, 0, 500);
}

/**
 * Read NOx sensor value (ppb)
 */
float readNOx() {
  int rawValue = analogRead(NOX_SENSOR_PIN);
  float nox = (rawValue / 4095.0) * 40.0;  // 0-40 ppb range
  nox += random(-5, 5) / 10.0;
  return constrain(nox, 0, 40);
}

/**
 * Read SOx sensor value (ppb)
 */
float readSOx() {
  int rawValue = analogRead(SOX_SENSOR_PIN);
  float sox = (rawValue / 4095.0) * 20.0;  // 0-20 ppb range
  sox += random(-3, 3) / 10.0;
  return constrain(sox, 0, 20);
}

/**
 * Calculate Air Quality Index based on sensor readings
 */
int calculateAQI(float pm25, float pm10, float co2) {
  // Simplified AQI calculation (EPA standard)
  float pm25_aqi = (pm25 / 50.0) * 100.0;
  float pm10_aqi = (pm10 / 100.0) * 100.0;
  float co2_aqi = ((co2 - 400) / 600.0) * 100.0;
  
  // Take the maximum of the three
  float aqi = max(pm25_aqi, max(pm10_aqi, co2_aqi));
  return constrain((int)aqi, 0, 100);
}

// ==================== SETUP ====================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("=================================");
  Serial.println("ESP32 Firebase Sensor Starting...");
  Serial.println("=================================");

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());

  // Configure Firebase
  config.api_key = FIREBASE_API_KEY;
  config.database_url = FIREBASE_DATABASE_URL;
  
  // Anonymous authentication (or use Firebase Auth if needed)
  Serial.println("Signing in to Firebase...");
  
  // For anonymous sign-in
  auth.user.email = "";
  auth.user.password = "";
  
  // Assign the callback function for token generation
  config.token_status_callback = tokenStatusCallback;
  
  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  // Wait for Firebase to be ready
  Serial.println("Waiting for Firebase connection...");
  while (!Firebase.ready()) {
    delay(100);
  }
  
  firebaseReady = true;
  Serial.println("Firebase Ready!");
  Serial.println("Starting sensor readings...");
  Serial.println();
}

// ==================== MAIN LOOP ====================

void loop() {
  if (firebaseReady && (millis() - sendDataPrevMillis > UPDATE_INTERVAL || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    
    // Read all sensors
    float pm25 = readPM25();
    float pm10 = readPM10();
    float co2 = readCO2();
    float co = readCO();
    float voc = readVOC();
    float nox = readNOx();
    float sox = readSOx();
    int aqi = calculateAQI(pm25, pm10, co2);
    
    // Get current timestamp
    unsigned long timestamp = millis();
    
    // Print readings to Serial Monitor
    Serial.println("──────────────────────────────────");
    Serial.printf("Room: %s | Time: %lu\n", ROOM_ID, timestamp);
    Serial.println("Air Quality Readings:");
    Serial.printf("  PM2.5: %.2f µg/m³\n", pm25);
    Serial.printf("  PM10:  %.2f µg/m³\n", pm10);
    Serial.printf("  CO2:   %.0f ppm\n", co2);
    Serial.printf("  CO:    %.2f ppm\n", co);
    Serial.printf("  VOC:   %.0f ppb\n", voc);
    Serial.printf("  NOx:   %.2f ppb\n", nox);
    Serial.printf("  SOx:   %.2f ppb\n", sox);
    Serial.printf("  AQI:   %d\n", aqi);
    
    // Create JSON object with sensor data
    FirebaseJson json;
    
    // Add air quality data
    FirebaseJson airQuality;
    airQuality.set("pm25", pm25);
    airQuality.set("pm10", pm10);
    airQuality.set("co2", co2);
    airQuality.set("co", co);
    airQuality.set("voc", voc);
    airQuality.set("nox", nox);
    airQuality.set("sox", sox);
    airQuality.set("aqi", aqi);
    
    json.set("roomId", ROOM_ID);
    json.set("timestamp", timestamp);
    json.set("airQuality", airQuality);
    
    // Path 1: Store in timestamped history
    String historyPath = "sensors/" + String(ROOM_ID) + "/" + String(timestamp);
    
    Serial.print("Sending to Firebase (history): ");
    Serial.println(historyPath);
    
    if (Firebase.RTDB.setJSON(&fbdo, historyPath, &json)) {
      Serial.println("✓ History data sent successfully");
    } else {
      Serial.println("✗ Failed to send history data");
      Serial.println("Reason: " + fbdo.errorReason());
    }
    
    // Path 2: Update latest reading
    String latestPath = "sensors/" + String(ROOM_ID) + "/latest";
    
    Serial.print("Updating latest reading: ");
    Serial.println(latestPath);
    
    if (Firebase.RTDB.setJSON(&fbdo, latestPath, &json)) {
      Serial.println("✓ Latest data updated successfully");
    } else {
      Serial.println("✗ Failed to update latest data");
      Serial.println("Reason: " + fbdo.errorReason());
    }
    
    Serial.println("──────────────────────────────────");
    Serial.println();
  }
}
