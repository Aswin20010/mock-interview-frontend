import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Mock Interview",
  description: "AI mock interviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-dvh bg-background text-foreground">
          <header className="border-b">
            <div className="mx-auto max-w-3xl p-4 flex items-center justify-between">
              <a href="/" className="font-semibold">Mock Interview</a>
              <nav className="text-sm flex items-center gap-4">
                <a href="/sign-in">Sign In</a>
                <a href="/sign-up"> Sign Up</a>
                <UserButton afterSignOutUrl="/" />
              </nav>
            </div>
          </header>

          <main className="w-screen h-screen overflow-x-hidden">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
