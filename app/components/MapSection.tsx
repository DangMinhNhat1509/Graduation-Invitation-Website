"use client";

import { useState, useEffect } from "react";
import Map, {
  Marker,
  ViewState,
  ViewStateChangeInfo,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type Position = {
  lat: number;
  lng: number;
};

const EVENT_FALLBACK: Position = {
  lat: 10.773374,
  lng: 106.660728,
};

export default function MapSection() {
  const [eventPos, setEventPos] = useState<Position>(EVENT_FALLBACK);
  const [gpsEnabled, setGpsEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [viewState, setViewState] = useState<ViewState>({
    longitude: EVENT_FALLBACK.lng,
    latitude: EVENT_FALLBACK.lat,
    zoom: 15,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsEnabled(false);
      setEventPos(EVENT_FALLBACK);
      setLoading(false);
      return;
    }

    // Lấy GPS ngay khi mở trang
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setEventPos(newPos);
          setViewState((prev) => ({
            ...prev,
            latitude: newPos.lat,
            longitude: newPos.lng,
          }));
          setGpsEnabled(true);
          setLoading(false);
        },
        () => {
          setGpsEnabled(false);
          setEventPos(EVENT_FALLBACK);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    };

    getLocation();

    // Lấy GPS lại mỗi 2 phút (120.000ms)
    const interval = setInterval(getLocation, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Đang load bản đồ...</div>;

  return (
    <div className="relative h-[420px] mt-10 border rounded-xl overflow-hidden">
      <Map
        {...viewState}
        onViewStateChange={(info: ViewStateChangeInfo) =>
          setViewState(info.viewState)
        }
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
        style={{ width: "100%", height: "100%" }}
      >
        <Marker latitude={eventPos.lat} longitude={eventPos.lng}>
          🎓
        </Marker>
      </Map>

      {!gpsEnabled && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-sm">
          Chủ tiệc chưa bật GPS. Đang dùng vị trí trường làm fallback.
        </div>
      )}

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${eventPos.lat},${eventPos.lng}`}
        target="_blank"
        className="absolute top-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
      >
        Chỉ đường bằng Google Maps
      </a>
    </div>
  );
}
