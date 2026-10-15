/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F7FB",   // exercise-book paper
        grid: "#DFE7F2",    // faint graph lines
        ink: "#1C2F6E",     // fountain-pen blue: text and primary actions
        "ink-soft": "#4A5C99",
        pencil: "#5B6475",  // secondary text
        marker: "#FFE45C",  // highlighter: the one accent
        "marker-soft": "#FFF3A8",
        leaf: "#1F7A4D",    // break time
        "leaf-soft": "#D9F1E3",
        redpen: "#B4232B",  // errors only
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
