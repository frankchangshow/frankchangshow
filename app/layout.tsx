import type { Metadata } from "next";
import {
  Fraunces,
  Geist,
  Instrument_Serif,
  Inter,
  Manrope,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Frank Chang — Private Coaching",
    template: "%s — Frank Chang",
  },
  description:
    "Frank Chang works privately with a small number of people who feel stuck or ready for a deeper next chapter.",
  metadataBase: new URL("https://frankchangshow.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${fraunces.variable} ${inter.variable} ${instrument.variable} ${manrope.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
