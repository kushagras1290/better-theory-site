import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { CursorTrail } from "@/components/CursorTrail";
import { WebGLStage } from "@/components/WebGLStage";

export const metadata: Metadata = {
  title: {
    default: "Better Theory | Immersive Digital Work",
    template: "%s | Better Theory",
  },
  description:
    "A high-motion, WebGL-first creative technology portfolio with deep project pages and Cloudflare-ready static export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WebGLStage />
        <CursorTrail />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
