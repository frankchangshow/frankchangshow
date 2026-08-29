import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frank Chang",
  description: "Frank Chang, Belmont, CA. @frankchangshow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${instrument.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <div className="grain" aria-hidden />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
