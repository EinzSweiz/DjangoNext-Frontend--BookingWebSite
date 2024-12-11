'use client'

import React, { useState } from "react";

const CustomNavbar: React.FC<{ onStatusChange: (status: string) => void }> = ({ onStatusChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStatusChange = (status: string) => {
    onStatusChange(status);
  };

  return (
    <nav className="bg-white text-black dark:bg-gray-800 dark:text-white fixed top-0 left-0 w-full z-0 shadow-md">
      <div className="max-w-screen-xl flex items-center px-10 py-2 mx-auto">
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black dark:text-white hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Navbar Items for Desktop and Mobile */}
        <div className={`w-full md:flex md:w-auto ${isMobileMenuOpen ? "block" : "hidden"} md:block`} id="navbar-multi-level">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:justify-start justify-center items-center">
            <li>
              <a
                href="/myinquiries"
                className="block py-1 px-3 rounded-md hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
                aria-current="page"
              >
                Tickets List
              </a>
            </li>

            {/* Action Buttons directly in Navbar */}
            <li className="relative">
              <button
                onClick={() => handleStatusChange('active')}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Active Tickets
              </button>
            </li>
            <li className="relative">
              <button
                onClick={() => handleStatusChange('resolved')}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Resolved Tickets
              </button>
            </li>
            <li className="relative">
              <button
                onClick={() => handleStatusChange('pending')}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Pending Tickets
              </button>
            </li>
            <li className="relative">
              <button
                onClick={() => handleStatusChange('queue')}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Tickets in queue
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
