import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next writes AGENTS.md on startup unless this is off.
  agentRules: false,
};

export default nextConfig;
