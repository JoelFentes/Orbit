/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
     colors: {
        // Light palette
          "azul-celeste": "#78c0e0ff",
          "azul-celestial": "#449dd1ff",


          // Dark palette

          // FUNDOS (Backgrounds) - Inversão do "white"
          "fundo-escuro-principal": "#202020",  // Fundo principal, um preto profundo. (Inverte "bege")
          "fundo-escuro-secundario": "#1e1e1eff", // Fundo de cards, barras ou elementos secundários. (Inverte "bege" com maior profundidade)

          // TEXTOS E FOREGROUND (Foreground) - Inversão dos azuis escuros
          "texto-claro-principal": "#f0f3ffff",   // Texto principal, um branco suave. (Inverte "azul-marinho" e "azul-federal")
          "texto-claro-secundario": "#b2daffff",  // Texto secundário ou acento sutil. (Inverte "azul-celeste")

          // ACENTOS E INTERATIVIDADE (Accents) - Inversão dos azuis de destaque
          "acento-primario": "#66b8f5ff",         // Cor principal para botões, links e destaques. (Inverte "azul-celestial")
          "acento-violeta": "#5f70d9ff"           // Cor para ícones ou elementos visuais. (Inverte "azul-violeta")
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
