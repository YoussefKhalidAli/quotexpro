import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    "Missing FIREBASE_SERVICE_ACCOUNT env variable" +
      process.env.FIREBASE_SERVICE_ACCOUNT
  );
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"), // fix escaped newlines
  }),
});

const db = getFirestore(app);
export default db;
