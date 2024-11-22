import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Modal from "./components/modals/Modal";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import AddPropertyModal from "./components/modals/AddPropertyModal";
import SearchModal from "./components/modals/SearchModal";
import Footer from "./components/footer/footer";
import ProfileModal from "./components/modals/ProfileModal";

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
    <html lang="en">
      <head>
        {/* You can also add other meta tags like for social media here */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <div className="pt-32">
          {children}
        </div>
        <ProfileModal />
        <LoginModal />
        <SearchModal />
        <SignupModal />
        <AddPropertyModal />
      </body>
    </html>
  );
}
