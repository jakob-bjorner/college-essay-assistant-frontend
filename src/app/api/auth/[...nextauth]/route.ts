import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import axios from "axios";

const secretKey = "bonk";
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
        token.id = profile.id
        token.id_token = account.id_token;
        const claims = {
          email: profile.email,
          sub: profile.id,
          name: profile.name,
          // Include more fields as needed
        };

        const options = {
          expiresIn: "1h",
          algorithm: "HS256",
        };

        const signedToken = jwt.sign(claims, secretKey, options);

        console.log("Signed Token:", signedToken);

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
    async session({ session, token }) {
      session.id_token = token.id_token;
      return session;
    },
  },
});
//ijol3e
export const GET = (req, res) => handler(req, res);
export const POST = (req, res) => handler(req, res);