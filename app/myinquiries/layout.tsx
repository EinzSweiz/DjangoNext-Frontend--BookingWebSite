import React from "react";
import CustomNavbar from "../components/navbar/CustomNavbar";
export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   // Example to force layout reload by using a key
    <html lang="en" key={window.location.pathname}>
      <body>
        <CustomNavbar />
        <main>{children}</main>
      </body>
    </html>

  );
}
