import { betterAuth } from "better-auth";
import { admin, phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db('anvikafashions');

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  database: mongodbAdapter(db, {
    client
  }),
  plugins: [
    admin(),
    phoneNumber({
      requireVerification: true,
      sendOTP: async ({ phoneNumber, code }) => {
        // Mock SMS Provider: Replace this with Twilio or another provider later
        console.log(`\n\n[MOCK SMS] -----------------------------`);
        console.log(`[MOCK SMS] Sending OTP: ${code}`);
        console.log(`[MOCK SMS] To Phone Number: ${phoneNumber}`);
        console.log(`[MOCK SMS] -----------------------------\n\n`);
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer"
      },
    }
  },
});
