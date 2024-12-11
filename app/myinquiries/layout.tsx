import React from "react";
import CustomNavbar from "../components/navbar/CustomNavbar";

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  console.log("Rendering Inquiry Layout");
  return (
    <html lang="en">
      <body>
        <CustomNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}