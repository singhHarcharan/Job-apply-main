/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9333ea",
        "primary-hover": "#7e22ce",
        secondary: "#4c1d95",
        accent: "#a855f7",
        background: "#1a1a1a",
        foreground: "#ffffff",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#ffffff",
            a: {
              color: "#9333ea",
              "&:hover": {
                color: "#7e22ce",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
