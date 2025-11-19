'use client';

import NavBar from "@/components/NavBar";
import rooms from "@/data/rooms.json";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";

function RoomModel({ rotation }: { rotation: number }) {
  const { scene } = useGLTF("/models/room.glb");
  // Memoize the scene so controls only adjust rotation value
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} rotation={[0, rotation, 0]} position={[0, -0.5, 0]} />;
}

function CameraRig({ distance }: { distance: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.2, distance);
  }, [camera, distance]);
  return null;
}

export default function Room3DPage({ params }: { params: { roomId: string } }) {
  const room = rooms.find((r) => r.id === params.roomId);
  const [rotation, setRotation] = useState(0);
  const [distance, setDistance] = useState(4);
  const [lightOn, setLightOn] = useState(true);
  const [mode, setMode] = useState<"day" | "night">("day");

  if (!room) return notFound();

  const skyPreset = mode === "day" ? "sunset" : "night";
  const ambientIntensity = lightOn ? (mode === "day" ? 1 : 0.4) : 0.1;
  const directionalIntensity = lightOn ? (mode === "day" ? 1.1 : 0.7) : 0.05;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Interactive room preview</p>
            <h1 className="text-2xl font-semibold text-slate-800">{room.name}</h1>
          </div>
          <div className="text-sm text-slate-500">Use buttons or drag to explore</div>
        </div>

        <div className="card">
          <div className="relative h-[480px] w-full overflow-hidden rounded-2xl bg-slate-900">
            <Canvas camera={{ position: [0, 1.2, distance], fov: 45 }}>
              <ambientLight intensity={ambientIntensity} />
              <directionalLight position={[2, 3, 2]} intensity={directionalIntensity} color={mode === "day" ? "white" : "#9fdcff"} />
              <RoomModel rotation={rotation} />
              <Environment preset={skyPreset as any} />
              <OrbitControls enablePan={false} target={[0, 1, 0]} />
              <CameraRig distance={distance} />
            </Canvas>
            <div className="absolute inset-x-0 bottom-4 mx-auto flex w-max flex-wrap items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg">
              <button onClick={() => setRotation((r) => r - 0.3)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Rotate ⟲</button>
              <button onClick={() => setRotation((r) => r + 0.3)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Rotate ⟳</button>
              <button onClick={() => setDistance((d) => Math.max(2, d - 0.5))} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Zoom in</button>
              <button onClick={() => setDistance((d) => Math.min(8, d + 0.5))} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Zoom out</button>
              <button onClick={() => setLightOn((v) => !v)} className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">{lightOn ? "Lights on" : "Lights off"}</button>
              <button onClick={() => setMode((m) => (m === "day" ? "night" : "day"))} className="rounded-full bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700">{mode === "day" ? "Switch to night" : "Switch to day"}</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

useGLTF.preload("/models/room.glb");
