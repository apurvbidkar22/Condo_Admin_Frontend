import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    colors: {
      primary: '#FC8663',
      secondary: '#043D59',
      hover: "#EDEDED",
      border: "#B4B4B4",
      black: '#000000',
      white: '#ffffff',
      warning: "#e11d48",
      error: "#e11d48",
      success: "#15803d"
    },
    fontFamily: {
      inter: ['Inter'],
      roboto: ['Roboto'],
      lato: ['Lato'],
      poppins: ['Poppins']
    },
    extend: {},
  },
  plugins: [],
};
export default config;
