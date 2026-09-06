import type { Metadata } from "next";
import {
  Fraunces,
  Gabarito,
  Instrument_Sans,
  Libre_Franklin,
  Manrope,
  Nunito_Sans,
} from "next/font/google";
import "./designs.css";
import { DesignSwitcher } from "./_components/DesignSwitcher";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "Frank Chang",
    template: "%s · Frank Chang",
  },
  robots: { index: false, follow: false },
};

export default function DesignsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${libreFranklin.variable} ${fraunces.variable} ${instrumentSans.variable} ${manrope.variable} ${gabarito.variable} ${nunitoSans.variable} designs-root flex min-h-full flex-1 flex-col`}
    >
      {children}
      <DesignSwitcher />
    </div>
  );
}
