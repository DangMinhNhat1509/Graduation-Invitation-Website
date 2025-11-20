import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing 'id'" }), { status: 400 });

    const ref = doc(db, "guests", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: "Guest not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, ...snapshot.data() }), { status: 200 });
  } catch (err) {
    console.error("Firebase error:", err); // <-- log lỗi
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

