import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
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
