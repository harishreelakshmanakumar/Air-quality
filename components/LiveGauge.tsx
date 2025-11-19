'use client';

import { useEffect, useState } from "react";

type Props = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  colorScheme?: 'green' | 'blue' | 'amber' | 'red';
  decimals?: number;
};

const colorSchemes = {
  green: {
    gradient: ['#10b981', '#22c55e', '#4ade80'],
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  blue: {
    gradient: ['#3b82f6', '#60a5fa', '#93c5fd'],
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  amber: {
    gradient: ['#f59e0b', '#fbbf24', '#fcd34d'],
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  red: {
    gradient: ['#ef4444', '#f87171', '#fca5a5'],
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
};

export default function LiveGauge({ label, value, unit, min, max, colorScheme = 'green', decimals = 1 }: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const [liveValue, setLiveValue] = useState(value);

  // Simulate live fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const variance = (max - min) * 0.02; // 2% variance
      const newValue = value + (Math.random() - 0.5) * variance;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      setLiveValue(clampedValue);
    }, 2000);

    return () => clearInterval(interval);
  }, [value, min, max]);

  // Animate display value
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = (liveValue - displayValue) / steps;
    let currentStep = 0;

    const animation = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(liveValue);
        clearInterval(animation);
      } else {
        setDisplayValue(prev => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(animation);
  }, [liveValue]);

  const percentage = ((displayValue - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 270 - 135; // 270 degree arc starting from -135deg

  const colors = colorSchemes[colorScheme];
  const gradientStyle = {
    background: `conic-gradient(
      from -135deg,
      ${colors.gradient[0]} 0deg,
      ${colors.gradient[1]} ${(percentage / 100) * 270}deg,
      #e2e8f0 ${(percentage / 100) * 270}deg
    )`,
  };

  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-xl ${colors.bg} border border-slate-200`}>
      <div className="relative h-32 w-32">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-full opacity-20" style={gradientStyle} />
        
        {/* Animated gradient arc */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out" 
          style={gradientStyle}
        />
        
        {/* Inner circle */}
        <div className="absolute inset-3 rounded-full bg-white shadow-lg grid place-items-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${colors.text}`}>
              {displayValue.toFixed(decimals)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{unit}</div>
          </div>
        </div>

        {/* Needle pointer */}
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-12 -ml-0.5 origin-bottom transition-transform duration-1000 ease-out"
          style={{ 
            transform: `rotate(${angle}deg) translateY(-100%)`,
            background: `linear-gradient(to bottom, ${colors.gradient[0]}, transparent)`,
          }}
        />
        
        {/* Center dot */}
        <div className={`absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
      </div>
      
      <div className="text-center">
        <p className={`text-sm font-semibold ${colors.text}`}>{label}</p>
        <p className="text-xs text-slate-500">
          Range: {min} - {max} {unit}
        </p>
      </div>
    </div>
  );
}
