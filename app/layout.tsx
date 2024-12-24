import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Modal from "./components/modals/Modal";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import ReviewModal from "./components/modals/ReviewModal";
import ChatBotModal from "./components/modals/ChatBotModal";
import AddPropertyModal from "./components/modals/AddPropertyModal";
import SearchModal from "./components/modals/SearchModal";
import ContactModal from "./contact/page";
import Footer from "./components/footer/footer";
import ProfileModal from "./components/modals/ProfileModal";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DiplomaPro",
  description: "We Write, You Graduate",
  icons: {
    icon: "/favicon.png", // Path to your icon
  },
};

export default function RootLayout({
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
          <Navbar />
          <div className="pt-32">{children}</div>
          <ProfileModal />
          <LoginModal />
          <ReviewModal />
          <SearchModal />
          <SignupModal />
          <AddPropertyModal />
          <ContactModal />
          <ChatBotModal />
          <Footer />
        </ThemeProvider>  
      </body>
    </html>
  );
}
