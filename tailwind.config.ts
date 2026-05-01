import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        braniva: {
          green: "#0f5132",
          leaf: "#1d7a46",
          gold: "#d7a11f",
          amber: "#f6c34a",
          cream: "#fff8e8",
          earth: "#efe2c7"
        }
      },
      boxShadow: {
        soft: "0 24px 70px rgba(15, 81, 50, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
