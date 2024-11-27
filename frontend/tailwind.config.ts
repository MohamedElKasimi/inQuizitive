import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:{
      'dark-blue' : "#4335A7",
      'light-blue' : "#80C4E9",
      'white' : "#FFF6E9",
      'orange' : "#FF7F3E",
      'black': "#000000",
    },
    extend: {
      fontFamily:{
        itim: ["var(--font-itim)"]
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;