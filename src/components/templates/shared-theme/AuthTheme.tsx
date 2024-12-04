"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
interface AuthThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AuthTheme({
  children,
  disableCustomTheme,
  themeComponents,
}: AuthThemeProps) {
  const loginTheme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          components: {
            ...inputsCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={(theme)=>({
        ...theme,
        ...loginTheme
      })}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
