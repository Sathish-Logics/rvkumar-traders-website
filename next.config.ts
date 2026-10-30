// Configures Next.js build behavior for the production application.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16's default TypeScript CLI path cannot parse this project's
  // TypeScript 5.9 --showConfig output; use the framework checker instead.
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
