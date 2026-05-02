/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-hover": "#3b82f6",
        surface: "#ffffff",
        background: "#f1f5f9",
        "text-base": "#0f172a",
        "text-muted": "#64748b",
        divider: "#e2e8f0",
        error: "#ef4444",
        "error-bg": "#fef2f2",
        // For navbar
        "nav-bg": "#2563EB",
        "nav-text": "#ffffff",
        "nav-text-muted": "#bfdbfe",
        "nav-active": "#93c5fd",
        "nav-hover": "#1d4ed8",
      },
    },
  },
  plugins: [],
};
