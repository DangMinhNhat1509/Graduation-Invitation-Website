import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing 'id' query param" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ref = doc(db, "guests", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: "Guest not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id, ...snapshot.data() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Firebase fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
