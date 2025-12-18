import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Dark theme - Deep purple/indigo with cyan accents
                dark: {
                    bg: "#0a0a1a",
                    surface: "#1a1a2e",
                    elevated: "#252541",
                    border: "#2d2d4a",
                    text: {
                        primary: "#e8e8f0",
                        secondary: "#a8a8c0",
                        tertiary: "#7878a0",
                    },
                    accent: {
                        primary: "#00d4ff",
                        secondary: "#7c3aed",
                        tertiary: "#a78bfa",
                    },
                },
                // Light theme - Soft lavender with vibrant purple accents
                light: {
                    bg: "#faf8ff",
                    surface: "#ffffff",
                    elevated: "#f5f3ff",
                    border: "#e9e5f5",
                    text: {
                        primary: "#1a1a2e",
                        secondary: "#4a4a68",
                        tertiary: "#6a6a88",
                    },
                    accent: {
                        primary: "#7c3aed",
                        secondary: "#a78bfa",
                        tertiary: "#00d4ff",
                    },
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["Fira Code", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-in-out",
                "slide-up": "slideUp 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
