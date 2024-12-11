'use client'

import React, { useState } from "react";

const CustomNavbar: React.FC<{ onStatusChange: (status: string) => void }> = ({ onStatusChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStatusChange = (status: string) => {
    onStatusChange(status);
  };

  return (
    <nav className="bg-white text-black fixed w-full shadow-md">
      <div className="max-w-screen-xl flex items-center px-10 py-2 mx-auto">
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-300"
          >
    
          </button>
        </div>

        {/* Navbar Items for Desktop */}
        <div className={`w-full md:flex md:w-auto ${isMobileMenuOpen ? "block" : "hidden"} md:block`} id="navbar-multi-level">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg md:flex-row md:space-x-8">
            <li>
              <a
                href="/myinquiries"
                className="block py-1 px-3 rounded-md hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-500"
                aria-current="page"
              >
                Tickets List
              </a>
            </li>

            {/* Actions Dropdown directly in Navbar */}
            <li className="relative">
              <button
                onClick={() => handleStatusChange('active')}
                className="block py-1 px-3 text-black hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Active Tickets
              </button>
            </li>
            <li className="relative">
              <button
                onClick={() => handleStatusChange('resolved')}
                className="block py-1 px-3 text-black hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Resolved Tickets
              </button>
            </li>
            <li className="relative">
              <button
                onClick={() => handleStatusChange('pending')}
                className="block py-1 px-3 text-black hover:bg-blue-800 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Pending Tickets
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
