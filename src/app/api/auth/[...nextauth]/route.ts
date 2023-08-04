import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import axios from "axios";
import https from "https";
import fs from "fs";

const sslCertFileName = "certificate.crt";
const sslKeyFileName = "private.key";
const secretKey = "bonk";
const algorithmm = "HS256";

const sslCert = fs.readFileSync(sslCertFileName);
const sslKey = fs.readFileSync(sslKeyFileName);

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
        token.id = profile.id;

        const claims = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
        };

        const options = {
          expiresIn: "1h",
          algorithm: algorithmm,
        };

        const signedToken = jwt.sign(claims, secretKey, options);

        console.log("User info as JWT:", signedToken);

        // Log the JWT token before sending it to the backend
        console.log("JWT token to be sent:", signedToken);

        // Sample CLD data
        const cldData = {
          homie: "John the mannnnnn",
        };

        // Combine JWT token and CLD data in the POST request
        try {
          const response = await axios.post(
            "https://127.0.0.1:5000/api/decrypt",
            { jwtToken: signedToken, cldData: cldData }, // Send the JWT token and CLD data as a JSON object
            {
              httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Ignore self-signed SSL certificate for local development
                cert: sslCert, // Set the SSL certificate
                key: sslKey, // Set the SSL key
              }),
            }
          );

          console.log("Decoded JWT token:", response.data);
        } catch (error) {
          console.error("Error sending JWT token to backend:", error);
        }

        return {
          ...token,
          signedToken,
        };
      }

      // Added token revoking logic here
      if (token && token.revoked) {
        throw new Error("Invalid token");
      }

      return token;
    },
  },
});
//say hey
// Export the handler for the GET method
export const GET = (req, res) => handler(req, res);

// Export the handler for the POST method
export const POST = (req, res) => handler(req, res);
