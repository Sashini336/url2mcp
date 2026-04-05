import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#08080e",
          secondary: "#0c0c14",
        },
        accent: {
          DEFAULT: "#00ff88",
          dark: "#00cc6a",
        },
        text: {
          primary: "#e8e8ec",
          secondary: "#78788a",
          tertiary: "#546e7a",
        },
      },
      fontFamily: {
        sans: ["var(--font-general-sans)", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Menlo", "Consolas", "'Courier New'", "monospace"],
      },
      borderRadius: {
        card: "14px",
        button: "10px",
        input: "11px",
        badge: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
