"use client";

import { useState, useRef, useEffect } from "react";
import { FaFlag } from "react-icons/fa"; // Import a flag icon

interface ReviewDropdownProps {
  onReport: () => void;
}

const ReviewDropdown: React.FC<ReviewDropdownProps> = ({ onReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Vertical Ellipsis Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-200 p-1"
      >
        &#x22EE;
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bottom-0 left-0 w-full bg-gray-900 text-white rounded-t-lg shadow-lg z-50 animate-slide-up"
        >
          {/* Close Button */}
          <button
            className="w-full text-gray-400 hover:text-gray-200 text-center py-2"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
          {/* Dropdown Options */}
          <button
            onClick={() => {
              setIsOpen(false);
              onReport();
            }}
            className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-700"
          >
            <FaFlag className="mr-2 text-gray-400" /> {/* Flag icon */}
            <span>Report</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewDropdown;
