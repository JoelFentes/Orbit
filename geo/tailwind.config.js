/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        aguamarinha: "#86e7b8ff",
        "verde-claro": "#93ff96ff",
        "verde-claro-2": "#b2ffa8ff",
        "verde-cha": "#d0ffb7ff",
        bege: "#f2f5deff",
      },
      fontFamily: {
        "quicksand-light": ["Quicksand_300Light"],
        "quicksand-regular": ["Quicksand_400Regular"],
        "quicksand-medium": ["Quicksand_500Medium"],
        "quicksand-semibold": ["Quicksand_600SemiBold"],
        "quicksand-bold": ["Quicksand_700Bold"],
      },
    },
  },
  plugins: [],
};
