// tailwind.config.ts
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        ring: "var(--color-ring)",
        input: "var(--color-input)",
        "input-background": "var(--color-input-background)",
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
      },
    },
  },
  safelist: [
    { pattern: /(bg|text|border|ring)-(primary|muted|foreground|destructive)(\/\d+)?/ },
  ],
};
