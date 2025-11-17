"use client";

import { useState, useEffect } from "react";
import { Map, Marker } from "react-map-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

const EVENT_LOCATION = {
  lat: 10.773374,
  lng: 106.660728,
};

export default function MapSection() {
  const [userPos, setUserPos] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      if (!navigator.geolocation) {
        setGpsEnabled(false);
        setUserPos({ lat: 10.77, lng: 106.66 }); // fallback IP
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsEnabled(true);
          setLoading(false);
        },
        () => {
          setGpsEnabled(false);
          setUserPos({ lat: 10.77, lng: 106.66 }); // fallback IP
          setLoading(false);
        }
      );
    }

    fetchLocation();
  }, []);

  if (loading || !userPos) return <div>Đang load bản đồ...</div>;

  return (
    <div className="relative h-[420px] mt-10 border rounded-xl overflow-hidden">
      <Map
        initialViewState={{
          latitude: EVENT_LOCATION.lat,
          longitude: EVENT_LOCATION.lng,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
      >
        <Marker latitude={EVENT_LOCATION.lat} longitude={EVENT_LOCATION.lng}>
          🎓
        </Marker>

        <Marker latitude={userPos.lat} longitude={userPos.lng}>
          🧭
        </Marker>
      </Map>

      {!gpsEnabled && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-sm">
          Bạn chưa bật GPS. Đã dùng vị trí gần đúng.
        </div>
      )}

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
