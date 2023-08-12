import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import axios from "axios";

const secretKey = "bonk";
let exportedToken = null;
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;

        const claims = {
          email: profile.email,
        };

        const options = {
          expiresIn: "1h",
          algorithm: "HS256",
        };

        const signedToken = jwt.sign(claims, secretKey, options);
        exportedToken = signedToken;

        // Modify the token to include the signedToken
        return {
          ...token,
          signedToken,
        };
      }

      if (token && token.revoked) {
        throw new Error("Invalid token");
      }

      return token;
    },
  },
});

export const GET = (req, res) => handler(req, res);
export const POST = (req, res) => handler(req, res);
export { exportedToken };
