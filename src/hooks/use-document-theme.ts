import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const read = (): Theme => (document.documentElement.classList.contains("light") ? "light" : "dark");

/**
 * The theme actually applied to <html>. Unlike next-themes' state, this updates only after the class
 * has changed, so canvas effects that read CSS variables see the new theme's values.
 */
export const useDocumentTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
};
