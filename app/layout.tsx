import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import { DesignSwitcher } from "./components/DesignSwitcher";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
        className={`${montserrat.variable} ${sourceSans.variable} min-h-full antialiased`}
      >
        {children}
        <DesignSwitcher />
      </body>
    </html>
  );
}
