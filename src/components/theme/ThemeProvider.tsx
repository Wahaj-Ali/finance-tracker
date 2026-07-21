"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function getChartTheme() {
  if (typeof window === "undefined") {
    return {
      grid: "#27272a",
      muted: "#71717a",
      tooltipBg: "#18181b",
      tooltipBorder: "#3f3f46",
      budgetBar: "#3f3f46",
      accent: "#dfff00",
    };
  }

  const styles = getComputedStyle(document.documentElement);
  return {
    grid: styles.getPropertyValue("--chart-grid").trim(),
    muted: styles.getPropertyValue("--chart-muted").trim(),
    tooltipBg: styles.getPropertyValue("--chart-tooltip-bg").trim(),
    tooltipBorder: styles.getPropertyValue("--chart-tooltip-border").trim(),
    budgetBar: styles.getPropertyValue("--chart-budget-bar").trim(),
    accent: styles.getPropertyValue("--accent").trim(),
  };
}

export function getCategoryChartColor(categoryId: string, theme: Theme): string {
  const dark: Record<string, string> = {
    household: "#DFFF00",
    car: "#B8E600",
    investments: "#9ACC00",
    lifestyle: "#E5FF4D",
    savings: "#C4FF00",
  };

  const light: Record<string, string> = {
    household: "#84cc16",
    car: "#65a30d",
    investments: "#4d7c0f",
    lifestyle: "#a3e635",
    savings: "#3f6212",
  };

  return (theme === "dark" ? dark : light)[categoryId] ?? "#84cc16";
}
