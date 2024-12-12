import React, { useState } from "react";
import apiService from "@/app/services/apiService";


const CustomNavbar: React.FC<{ onInquiriesFetch: (data: any[]) => void }> = ({ onInquiriesFetch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchInquiriesByStatus = async (status: string) => {
    try {
      const response = await apiService.getWithToken(`/api/inquiries/get/?status=${status}`);
      onInquiriesFetch(response); // Pass the data to the parent component
    } catch (err) {
      console.error("Error fetching inquiries by status:", err);
    }
  };

  const fetchQueueInquiries = async () => {
    try {
      const response = await apiService.getWithToken(`/api/inquiries/get/?queue=true`);
      onInquiriesFetch(response); // Pass the data to the parent component
    } catch (err) {
      console.error("Error fetching inquiries in queue:", err);
    }
  };

  return (
    <nav className="bg-white text-black dark:bg-gray-800 dark:text-white fixed w-full relative z-0 shadow-md">
      <div className="max-w-screen-xl flex items-center px-10 py-2 mx-auto">
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

        <div className={`w-full md:flex md:w-auto ${isMobileMenuOpen ? "block" : "hidden"} md:block`} id="navbar-multi-level">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:justify-start justify-center items-center">
            <li>
              <button
                onClick={() => fetchInquiriesByStatus("active")}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Active Tickets
              </button>
            </li>
            <li>
              <button
                onClick={() => fetchInquiriesByStatus("resolved")}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Resolved Tickets
              </button>
            </li>
            <li>
              <button
                onClick={() => fetchInquiriesByStatus("pending")}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Pending Tickets
              </button>
            </li>
            <li>
              <button
                onClick={() => fetchQueueInquiries()}
                className="block py-1 px-3 text-black dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-500"
              >
                Tickets in Queue
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
