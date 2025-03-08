"use client";

import { ThemeProvider } from "@/themes/themeContext";
import { ReactNode } from "react";

type ClientProviderProps = {
  children: ReactNode;
};

export default function ClientProvider({ children }: ClientProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
