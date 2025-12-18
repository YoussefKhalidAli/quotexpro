import admin from "firebase-admin";

// Initialize app without credentials
const app = admin.initializeApp({
  projectId: "invoice-app", // just a name for local emulator
});

const db = admin.firestore();

// Connect to emulator
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:9011";
  db.settings({
    host: "localhost:9011",
    ssl: false,
  });
}

export default db;
