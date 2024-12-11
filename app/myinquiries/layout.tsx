import React from "react";
import CustomNavbar from "../components/navbar/CustomNavbar";
export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomNavbar />
        <main>{children}</main>
        {/* No Footer */}
      </body>
    </html>
  );
}