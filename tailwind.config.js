/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  rippleui: {
		removeThemes: ["dark", "light", "whateverTheme"],
	},
  theme: {
    extend: {},
  },
  plugins: [require("rippleui")],
}