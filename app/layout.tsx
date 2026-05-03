import type { Metadata } from "next";
import type { ReactNode } from "react";

// import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";
import { Manrope, Sora, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Edu-Nest",
  description: "EduNest — Learn. Grow. Succeed.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${grotesk.variable} ${sora.variable}`}
    >
      <body className="antialiased bg-light_bg text-light_text dark:bg-dark_bg dark:text-dark_text font-manrope">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>

        {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} /> */}
      </body>
    </html>
  );
}
