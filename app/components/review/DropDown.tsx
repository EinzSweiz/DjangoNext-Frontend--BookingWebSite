"use client";

import { useState, useRef, useEffect } from "react";

interface ReviewDropdownProps {
  onReport: () => void;
}

const ReviewDropdown: React.FC<ReviewDropdownProps> = ({ onReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
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
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-white text-lg p-1"
      >
        &#x22EE; {/* Vertical Ellipsis */}
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded-lg shadow-lg"
          ref={dropdownRef}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onReport();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewDropdown;
