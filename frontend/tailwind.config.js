export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#172033",
        leaf: "#1f9d74",
        sky: "#2f80ed",
        amber: "#f5a524",
        svmsBlue: "#0b2447",
        svmsOrange: "#f47721"
      },
      boxShadow: {
        soft: "0 22px 60px rgba(11, 36, 71, 0.12)"
      }
    }
  },
  plugins: []
};
