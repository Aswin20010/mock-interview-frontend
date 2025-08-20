import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Interview",
  description: "AI mock interviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto max-w-3xl p-4 flex items-center justify-between">
            <a href="/" className="font-semibold">Mock Interview</a>
            <nav className="text-sm">
              <a href="/" className="hover:underline">Home</a>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-3xl p-4">{children}</div>
      </body>
    </html>
  );
}
