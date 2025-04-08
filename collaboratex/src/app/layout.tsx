import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CollaboraTex",
    template: "%s - CollaboraTex",
  },
  description: "Collaborative LaTeX editor for academic papers",
  keywords: ["LaTeX", "collaboration", "editor", "real-time", "academic"],
  authors: [
    {
      name: "CollaboraTex Team",
    },
  ],
  creator: "CollaboraTex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider defaultTheme="system" storageKey="collaboratex-theme">
          <AuthProvider>
            <main className="flex min-h-screen flex-col">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
