import React from "react";
import CustomNavbar from "../components/navbar/CustomNavbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css"; // Correct path to globals.css
import { ThemeProvider } from "../components/theme-provider";
// Correct paths to the font files relative to the subdirectory
const geistSans = localFont({
  src: "../fonts/GeistVF.woff", // Relative to `app/myinquiries/`
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff", // Relative to `app/myinquiries/`
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DiplomaPro",
  description: "We Write, You Graduate",
  icons: {
    icon: "/favicon.ico", // Path to favicon
  },
};

export default function InquiryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta tags for SEO or social media */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomNavbar />
          <div className="pt-32">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
