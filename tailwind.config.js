/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', flowbite.content()],
    theme: {
        extend: {},
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            emerald: colors.emerald,
            indigo: colors.indigo,
            yellow: colors.yellow,
            "primary": "#09090b",
            "secondary": "#596673",
            "secondary-white": "#A9ABAE", // #F5F7FA darkened 30% (https://www.cssfontstack.com/oldsites/hexcolortool/)
            "highlighted": "#0D92F4",
            "header": "#1C1C1D",
            "body": "#1C1C1D",
            "footer": "#1C1C1D",
        },
    },
    darkMode: 'class',
    plugins: [flowbite.plugin()],
}

