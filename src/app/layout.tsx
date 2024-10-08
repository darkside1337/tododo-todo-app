import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const roboto = Roboto({ subsets: ["latin"], weight: ["700", "400"] });

export const metadata: Metadata = {
  title: "TODODO!",
  description: "Todo App, but named TODODO!",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className} min-h-screen grid place-items-center`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative ">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
