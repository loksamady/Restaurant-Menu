/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        translate: {
          "0%": { transform: "translateY(25%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        translate: "translate 1s ease-out",
        fade: "fadeOut 2s ease-in-out",
        wiggle: "wiggle 0.5s ease-in-out infinite",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        "csx-color-1": "#0652E9",
        "csx-color-2": "#38B6FF",
        "csx-color-3": "#050B3D",
        "primary-light": "#8ecae6",
        primary: "#219ebc",
        "primary-dark": "#023047",
        "secondary-light": "#F7D08A",
        secondary: "#ffb703",
        "secondary-dark": "#fb8500",
      }),
      textColor: () => ({
        "csx-color-1": "#0652E9",
        "csx-color-2": "#38B6FF",
        "csx-color-3": "#050B3D",
        "primary-light": "#8ecae6",
        primary: "#219ebc",
        "primary-dark": "#023047",
        "secondary-light": "#F7D08A",
        secondary: "#ffb703",
        "secondary-dark": "#fb8500",
      }),
      borderColor: (theme) => ({
        ...theme("colors"),
        "csx-color-1": "#0652E9",
        "csx-color-2": "#38B6FF",
        "csx-color-3": "#050B3D",
        "primary-light": "#8ecae6",
        primary: "#219ebc",
        "primary-dark": "#023047",
        "secondary-light": "#F7D08A",
        secondary: "#ffb703",
        "secondary-dark": "#fb8500",
      }),
    },
  },
  plugins: [],
};
