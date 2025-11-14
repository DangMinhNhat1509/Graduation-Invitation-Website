"use client";

import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Map, { Marker } from "react-map-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

const EVENT_LOCATION = {
  lat: 10.773374,
  lng: 106.660728,
};

export default function MapSection() {
  const [userPos, setUserPos] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState(null);

  // ✔ fallback location bằng IP khi tắt GPS
  async function getIPLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return { lat: data.latitude, lng: data.longitude };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchLocation() {
      if (!navigator.geolocation) {
        setGpsEnabled(false);
        const ip = await getIPLocation();
        setUserPos(ip);
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsEnabled(true);
          setLoading(false);
        },
        async () => {
          setGpsEnabled(false);
          const ip = await getIPLocation();
          setUserPos(ip);
          setLoading(false);
        }
      );
    }

    fetchLocation();
  }, []);

  // ✔ Vẽ đường đi bằng Mapbox Directions API
  useEffect(() => {
    if (!mapRef || !userPos || !gpsEnabled) return;

    const directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX,
      unit: "metric",
      profile: "mapbox/driving",
      alternatives: false,
      controls: {
        inputs: false,
        instructions: false,
      },
    });

    mapRef.getMap().addControl(directions);

    directions.setOrigin([userPos.lng, userPos.lat]);
    directions.setDestination([EVENT_LOCATION.lng, EVENT_LOCATION.lat]);
  }, [mapRef, userPos, gpsEnabled]);

  return (
    <div className="relative h-[420px] mt-10 border rounded-xl overflow-hidden">

      {/* 🕗 Loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {/* 🗺️ MAP */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
        initialViewState={{
          latitude: EVENT_LOCATION.lat,
          longitude: EVENT_LOCATION.lng,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        ref={(ref) => setMapRef(ref)}
      >
        {/* 🎓 Marker sự kiện */}
        <Marker latitude={EVENT_LOCATION.lat} longitude={EVENT_LOCATION.lng}>
          🎓
        </Marker>

        {/* 🧭 Marker user */}
        {userPos && (
          <Marker latitude={userPos.lat} longitude={userPos.lng}>
            🧭
          </Marker>
        )}
      </Map>

      {/* ⚠ Popup animate khi GPS tắt */}
      {!gpsEnabled && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-sm animate-fade-in">
          Bạn chưa bật GPS. Đã dùng vị trí gần đúng.
        </div>
      )}

      {/* 🧭 Nút Google Maps */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${EVENT_LOCATION.lat},${EVENT_LOCATION.lng}`}
        target="_blank"
        className="absolute top-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
      >
        Chỉ đường bằng Google Maps
      </a>
    </div>
  );
}
