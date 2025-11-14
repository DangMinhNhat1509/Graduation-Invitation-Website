// app/api/guest/route.js
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return Response.json({ error: "Missing 'id'" }, { status: 400 });

  const snap = await getDoc(doc(db, "guests", id));
  if (!snap.exists())
    return Response.json({ error: "Guest not found" }, { status: 404 });

  return Response.json({ id, ...snap.data() });
}
