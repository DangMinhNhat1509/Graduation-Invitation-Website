"use client";

import { useState, FormEvent } from "react";
import { getFirestore, collection, addDoc, Firestore } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

interface RSVPFormProps {
  guestId?: string;
  guestName?: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT,
};

let db: Firestore;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore();
}

export default function RSVPForm({ guestId, guestName }: RSVPFormProps) {
  const [name, setName] = useState<string>(guestName || "");
  const [phone, setPhone] = useState<string>("");
  const [coming, setComing] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await addDoc(collection(db, "rsvps"), {
        guestId: guestId ?? null,
        name,
        phone,
        coming,
        message,
        createdAt: new Date().toISOString(),
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Gửi thất bại, vui lòng thử lại sau.");
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="p-4 bg-green-50 rounded-md text-green-800">
        🎉 Cảm ơn bạn! Chúng mình đã nhận RSVP của bạn.
      </div>
    );

  return (
    <form onSubmit={submit} className="mt-6 space-y-3 bg-white/80 p-4 rounded-lg shadow">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên"
        className="w-full p-2 rounded border"
        required
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Số điện thoại (tuỳ chọn)"
        className="w-full p-2 rounded border"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Lời nhắn / chúc mừng"
        className="w-full p-2 rounded border"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" checked={coming} onChange={() => setComing(true)} /> Tham dự
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={!coming} onChange={() => setComing(false)} /> Không tham dự
        </label>
      </div>

      <button
        disabled={sending}
        className="px-4 py-2 bg-purple-600 disabled:opacity-50 text-white rounded"
      >
        {sending ? "Đang gửi..." : "Gửi RSVP"}
      </button>
    </form>
  );
}
