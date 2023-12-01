import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Component } from "react";
import { AppProps } from "next/app";
// import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
// import { NextAuthProvider } from "./providers";
import { getCurrentScheme } from "@/utils/colorScheme";
import Sidebar from "../components/Sidebar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cledge Essay Assistant",
  description: "Build effective essays",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scheme = await getCurrentScheme();
  return (
    <html lang="en" className={scheme === "dark" ? "dark" : ""}>
      <body className={inter.className}>
        <div className="h-screen flex flex-row justify-start">
          {/* <Sidebar /> */}
          <div className="bg-primary flex-1 p-4 text-white">{children}</div>
        </div>
        {/* <NextAuthProvider>{children}</NextAuthProvider> */}
      </body>
    </html>
  );
}
