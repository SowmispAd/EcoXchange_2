const admin = require("firebase-admin");

let appInitialized = false;

function initFirebaseAdmin() {
  if (appInitialized || admin.apps.length) {
    appInitialized = true;
    return admin;
  }
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const cred = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    } else {
      return null;
    }
    appInitialized = true;
    return admin;
  } catch (e) {
    console.warn("[firebase-admin] init skipped:", e.message);
    return null;
  }
}

async function verifyIdTokenSafe(idToken) {
  const a = initFirebaseAdmin();
  if (!a) return null;
  try {
    return await a.auth().verifyIdToken(idToken);
  } catch (e) {
    const err = new Error(e.message || "Invalid Firebase token");
    err.statusCode = 401;
    throw err;
  }
}

module.exports = { admin, initFirebaseAdmin, verifyIdTokenSafe };
