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
        "azul-celeste": "#78c0e0ff",   // sky-blue
        "azul-celestial": "#449dd1ff", // celestial-blue
        "azul-marinho": "#150578ff",   // navy-blue
        "azul-federal": "#0e0e52ff",   // federal-blue
        "azul-violeta": "#3943b7ff",   // violet-blue
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
