"use client";

import ClientProvider from "@/components/ClientProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <ClientProvider>
      <ThemeToggle />
    </ClientProvider>
  );
}
