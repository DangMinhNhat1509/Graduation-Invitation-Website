"use client";

import { useEffect, useState } from "react";
import MapGL, { Marker, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

type Position = { lat: number; lng: number };

const FALLBACK: Position = { lat: 10.773374, lng: 106.660728 }; // Trường FPT fallback

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT,
};

let db: any;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore();
}

export default function MapSection() {
  const [hostPos, setHostPos] = useState<Position>(FALLBACK);
  const [myPos, setMyPos] = useState<Position>(FALLBACK);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const [viewport, setViewport] = useState<ViewState>({
    latitude: FALLBACK.lat,
    longitude: FALLBACK.lng,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // Lấy vị trí host realtime từ Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "host"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.lat && data?.lng) {
          setHostPos({ lat: data.lat, lng: data.lng });
          setViewport((prev) => ({
            ...prev,
            latitude: data.lat,
            longitude: data.lng,
          }));
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Lấy định vị khách
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsEnabled(false);
      return;
    }

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos(newPos);
        setGpsEnabled(true);

        // Tính khoảng cách khách -> host
        const dist = getDistance(newPos, hostPos);
        setShowArrow(dist < 200); // <200m bật mũi tên
      },
      () => setGpsEnabled(false),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, [hostPos]);

  if (loading) return <div>Đang load bản đồ...</div>;

  return (
    <div className="relative h-[420px] mt-10 border rounded-xl overflow-hidden">
      <MapGL
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
        style={{ width: "100%", height: 420 }}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <Marker latitude={hostPos.lat} longitude={hostPos.lng}>
          {showArrow ? "🡆" : "🎓"} {/* mũi tên nếu gần, cột mốc nếu xa */}
        </Marker>
      </MapGL>

      {!gpsEnabled && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-sm">
          GPS khách tắt, chỉ đường bằng fallback.
        </div>
      )}

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${hostPos.lat},${hostPos.lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute top-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
      >
        Chỉ đường bằng Google Maps
      </a>
    </div>
  );
}

// Hàm tính khoảng cách 2 điểm (m)
function getDistance(a: Position, b: Position) {
  const R = 6371000; // bán kính Trái đất
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const c = 2 * Math.atan2(
    Math.sqrt(Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2),
    Math.sqrt(1 - (Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2))
  );
  return R * c;
}
