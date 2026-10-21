import type { Metadata } from "next";
import BuildHouseGame from "@/components/BuildHouseGame";

export const metadata: Metadata = {
  title: "Build a House",
  description: "Build your house, then defend it when other people come for it.",
};

export default function BuildAHousePage() {
  return <BuildHouseGame />;
}
