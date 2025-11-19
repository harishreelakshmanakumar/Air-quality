'use client';

import MetricCard from "@/components/MetricCard";
import LiveGauge from "@/components/LiveGauge";
import NavBar from "@/components/NavBar";
import rooms from "@/data/rooms.json";
import metrics from "@/data/metrics.json";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CloudSensorData = {
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

type SensorStatus = {
  status: 'online' | 'warning' | 'offline';
  lastUpdate: string | null;
  minutesAgo: number;
};

function AnimatedGauge({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplay(value), 150);
    return () => clearTimeout(timeout);
  }, [value]);

  const gradient = useMemo(
    () => ({
      background: `conic-gradient(#22c55e ${display * 3.6}deg, #e2e8f0 0deg)`,
    }),
    [display]
  );

  return (
    <div className="relative h-36 w-36">
      <div className="absolute inset-0 rounded-full" style={gradient} />
      <div className="absolute inset-3 rounded-full bg-white shadow-inner border border-slate-100 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-slate-800">{display}%</div>
          <div className="text-xs text-slate-500">Room health</div>
        </div>
      </div>
    </div>
  );
}

export default function RoomMetricsPage({ params }: { params: { roomId: string } }) {
  const room = rooms.find((r) => r.id === params.roomId);
  const metric = metrics.find((m) => m.roomId === params.roomId);

  const [cloudData, setCloudData] = useState<CloudSensorData | null>(null);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus | null>(null);
  const [useCloudData, setUseCloudData] = useState(false);

  // Fetch sensor data from Firebase/Cloud
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const response = await fetch(`/api/sensors/${params.roomId}`);
        const result = await response.json();
        
        if (result.success && result.data.latest) {
          setCloudData(result.data.latest);
          setSensorStatus(result.data.status);
          setUseCloudData(true);
        }
      } catch (error) {
        console.log('Using local data - Cloud sensors not configured');
        setUseCloudData(false);
      }
    };

    fetchCloudData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchCloudData, 5000);
    return () => clearInterval(interval);
  }, [params.roomId]);

  if (!room || !metric) return notFound();

  // Use cloud data if available, otherwise use local metrics
  const displayData = useCloudData && cloudData ? cloudData : metric;

  const overall = Math.round((metric.ecoScore + displayData.airQuality.aqi + (100 - metric.noise)) / 3);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-slate-500">Environmental snapshot</p>
              <h1 className="text-2xl font-semibold text-slate-800">{room.name}</h1>
              <p className="text-sm text-slate-500">Eco score {metric.ecoScore} · Quiet at {metric.noise} dB</p>
            </div>
            
            {/* Sensor Status Indicator */}
            {sensorStatus && useCloudData && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                sensorStatus.status === 'online' ? 'bg-green-100 text-green-700' :
                sensorStatus.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  sensorStatus.status === 'online' ? 'bg-green-500 animate-pulse' :
                  sensorStatus.status === 'warning' ? 'bg-amber-500' :
                  'bg-red-500'
                }`} />
                <div className="text-sm font-semibold">
                  {sensorStatus.status === 'online' ? '🔴 Live from Cloud' :
                   sensorStatus.status === 'warning' ? 'Sensor Delay' :
                   'Sensors Offline'}
                </div>
                {sensorStatus.lastUpdate && (
                  <div className="text-xs">
                    {sensorStatus.minutesAgo < 1 ? 'Just now' : `${sensorStatus.minutesAgo}m ago`}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {useCloudData && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
                <span className="text-sm font-semibold">☁️ Real-time data from Cloud (Firebase)</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-card border border-slate-100">
          <AnimatedGauge value={overall} />
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <p className="text-base font-semibold text-slate-800">Animated room health meter</p>
            <p>
              Blends eco score, air quality, and quietness into a quick-glance meter. Conic gradient animates into place to feel more
              “live”.
            </p>
            <p className="text-xs text-slate-500">Inputs: eco score {metric.ecoScore}, AQI {metric.airQuality.aqi}, noise {metric.noise} dB.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-stretch">
          <MetricCard title="Air Quality" subtitle="Live-like sensors" value={`AQI ${metric.airQuality.aqi}`}>
            <div className="grid grid-cols-3 gap-2 text-sm text-slate-700">
              <span className="rounded-lg bg-slate-100 px-3 py-2">CO₂ {metric.airQuality.co2} ppm</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">PM2.5 {metric.airQuality.pm25} µg/m³</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">PM10 {metric.airQuality.pm10} µg/m³</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">SOx {metric.airQuality.sox} ppb</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">NOx {metric.airQuality.nox} ppb</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">VOC {metric.airQuality.voc} ppb</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">CO {metric.airQuality.co} ppm</span>
              <span className="rounded-lg bg-slate-100 px-3 py-2">AQI {metric.airQuality.aqi}</span>
            </div>
          </MetricCard>

          <MetricCard title="Water Quality" subtitle="Sink & shower">
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              <span className="rounded-lg bg-emerald-50 px-3 py-2">TDS {metric.waterQuality.tds} ppm</span>
              <span className="rounded-lg bg-emerald-50 px-3 py-2">pH {metric.waterQuality.ph}</span>
              <span className="rounded-lg bg-emerald-50 px-3 py-2">Turbidity {metric.waterQuality.turbidity} NTU</span>
              <span className="rounded-lg bg-emerald-50 px-3 py-2">DO {metric.waterQuality.dissolvedOxygen} mg/L</span>
            </div>
          </MetricCard>

          <MetricCard title="Comfort" subtitle="Temp & humidity">
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              <span className="rounded-lg bg-sky-50 px-3 py-2">{metric.temperature}°C</span>
              <span className="rounded-lg bg-sky-50 px-3 py-2">{metric.humidity}% RH</span>
            </div>
          </MetricCard>

          <MetricCard title="Noise" subtitle="Last 24h" value={`${metric.noise} dB`}>
            <p className="text-sm text-slate-600">Quiet enough for deep sleep with acoustic panels and soft-close doors.</p>
          </MetricCard>

          <MetricCard title="Eco-friendly score" subtitle="Energy + water + materials" value={metric.ecoScore}>
            <p className="text-sm text-slate-600">Points for renewables, filtered air, and low-VOC materials. Optimized cleaning schedules save water.</p>
          </MetricCard>
        </div>

        {/* Live Monitoring Section - Air Quality */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Live Air Quality Monitoring</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            <LiveGauge 
              label="PM2.5" 
              value={displayData.airQuality.pm25} 
              unit="µg/m³" 
              min={0} 
              max={50} 
              colorScheme="green"
            />
            <LiveGauge 
              label="PM10" 
              value={displayData.airQuality.pm10} 
              unit="µg/m³" 
              min={0} 
              max={100} 
              colorScheme="green"
            />
            <LiveGauge 
              label="SOx" 
              value={displayData.airQuality.sox} 
              unit="ppb" 
              min={0} 
              max={20} 
              colorScheme="blue"
            />
            <LiveGauge 
              label="NOx" 
              value={displayData.airQuality.nox} 
              unit="ppb" 
              min={0} 
              max={40} 
              colorScheme="blue"
            />
            <LiveGauge 
              label="VOC" 
              value={displayData.airQuality.voc} 
              unit="ppb" 
              min={0} 
              max={500} 
              colorScheme="amber"
            />
            <LiveGauge 
              label="CO" 
              value={displayData.airQuality.co} 
              unit="ppm" 
              min={0} 
              max={5} 
              colorScheme="red"
              decimals={2}
            />
            <LiveGauge 
              label="CO₂" 
              value={displayData.airQuality.co2} 
              unit="ppm" 
              min={400} 
              max={1000} 
              colorScheme="amber"
              decimals={0}
            />
            <LiveGauge 
              label="AQI" 
              value={displayData.airQuality.aqi} 
              unit="index" 
              min={0} 
              max={100} 
              colorScheme="green"
              decimals={0}
            />
          </div>
        </div>

        {/* Live Monitoring Section - Water Quality */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Live Water Quality Monitoring</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <LiveGauge 
              label="TDS" 
              value={displayData.waterQuality?.tds || metric.waterQuality.tds} 
              unit="ppm" 
              min={0} 
              max={100} 
              colorScheme="blue"
            />
            <LiveGauge 
              label="Turbidity" 
              value={displayData.waterQuality?.turbidity || metric.waterQuality.turbidity} 
              unit="NTU" 
              min={0} 
              max={5} 
              colorScheme="blue"
            />
            <LiveGauge 
              label="pH Level" 
              value={displayData.waterQuality?.ph || metric.waterQuality.ph} 
              unit="pH" 
              min={6.0} 
              max={8.5} 
              colorScheme="green"
            />
            <LiveGauge 
              label="Dissolved O₂" 
              value={displayData.waterQuality?.dissolvedOxygen || metric.waterQuality.dissolvedOxygen} 
              unit="mg/L" 
              min={5} 
              max={12} 
              colorScheme="green"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
