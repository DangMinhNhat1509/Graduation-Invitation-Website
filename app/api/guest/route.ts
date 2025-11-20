// app/api/guest/route.ts
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(
        JSON.stringify({ error: "Missing 'id'" }),
        { status: 400 }
      );

    // Lấy document từ admin SDK
    const snapshot = await adminDb.collection("guests").doc(id).get();

    if (!snapshot.exists) {
      return new Response(
        JSON.stringify({ error: "Guest not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ id, ...snapshot.data() }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Firebase Admin error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
