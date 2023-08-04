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

const expectedCLD = `-----BEGIN CERTIFICATE-----
MIID5TCCAs2gAwIBAgIUNGP39aEwuN5w3HTdOzu05drJ9qEwDQYJKoZIhvcNAQEL
BQAwgYExCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJXQTESMBAGA1UEBwwJc2FtbWFt
aXNoMQ0wCwYDVQQKDARtaXR1MQ0wCwYDVQQLDARtaXR1MQ0wCwYDVQQDDARtaXR1
MSQwIgYJKoZIhvcNAQkBFhVrb3Ntb3NrZWVic0BnbWFpbC5jb20wHhcNMjMwODAz
MDExODIxWhcNMjQwODAyMDExODIxWjCBgTELMAkGA1UEBhMCVVMxCzAJBgNVBAgM
AldBMRIwEAYDVQQHDAlzYW1tYW1pc2gxDTALBgNVBAoMBG1pdHUxDTALBgNVBAsM
BG1pdHUxDTALBgNVBAMMBG1pdHUxJDAiBgkqhkiG9w0BCQEWFWtvc21vc2tlZWJz
QGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALsBAGZ8
p833LoTclNH5YfFdPjz5m83+LcYPFVGpPKvbWVz49UAezu8S0PFlt1CSISFSgddB
T8BJRHMt/ZACLUZKUMeNCTehi6hseiyJ+J0e5Rwojlq1jEHF7+VEJWMQo/sM55Hw
gskrDZ1AyOYe/UT9DOJ0a/C52d7PmzkPgbId2jjezih6Xybh3I6LeJMzcjEQnBm+
aUuQiy5kRWmWCIqxiu7Mcu6zcYJYgCJ3CglaDRtfLpL6br2S0biQxjPFaXUDPezY
852ng9TocRKz3sFYPofpmW3OVDqk0ZmAijZP/aG9unV27zPB4VBY4QMAxWWpnYOP
MpC4I5udAuMd+3cCAwEAAaNTMFEwHQYDVR0OBBYEFKtN32EX5wTeBJWbwW3ITU2v
xeEWMB8GA1UdIwQYMBaAFKtN32EX5wTeBJWbwW3ITU2vxeEWMA8GA1UdEwEB/wQF
MAMBAf8wDQYJKoZIhvcNAQELBQADggEBADT5+9a8EG277jt4S47bl0gyzqUv2z49
b61LGsxVKq+Dn2FSYd08GtIW6YJtBzS524NYjVGh5CnXUcJq4mYqOIg5mG0OTRLF
zzjejKGIAl8/jkRSweYaTPiV5gNL8GbaW34B1zMkfzHkztaI1py80WjMfmUxiuGM
JJZ6mzOMwgaDUx4tTCGYe5pEMW6iwPTdiL3EH2FwJX1luNLPgtZRstjFblvCfGa5
ki59NpY1ofKtA5BRC/euqdGgVbkjiQ8+5PNe5xIQbGhWRk0267GuPYtuv3XHSv4K
/BVOGNdJw7eLxAqtR2PB95XBmtQavVoelIZzXA6tq2YbjMEOyjnEOCY=
-----END CERTIFICATE-----`;

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
          CLD: expectedCLD, // Send the CLD as a simple string
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

// Export the handler for the GET method
export const GET = (req, res) => handler(req, res);

// Export the handler for the POST method
export const POST = (req, res) => handler(req, res);
