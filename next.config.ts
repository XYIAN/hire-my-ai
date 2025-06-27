import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: 'standalone',
	serverExternalPackages: ['openai'],
	env: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
};

export default nextConfig;
