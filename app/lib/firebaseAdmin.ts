import admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n"); // <--- quan trọng

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const adminDb = admin.firestore();
