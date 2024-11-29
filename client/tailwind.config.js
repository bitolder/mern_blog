/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],

  theme: {
    extend: {
      colors: {
        "custom-gray": "rgb(75, 85, 99)", // Ajout de votre couleur personnalisée
      },
    },
  },
  plugins: [flowbite.plugin(), require("tailwind-scrollbar")],
};
