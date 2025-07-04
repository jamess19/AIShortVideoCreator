import type React from "react";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            {children}
          </div>
        </ThemeProvider>
  );
}
