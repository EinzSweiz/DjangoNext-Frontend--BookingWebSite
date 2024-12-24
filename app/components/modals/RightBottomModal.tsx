"use client";
import React, { useState, useEffect, useCallback } from "react";

interface RightBottomModalProps {
  isOpen: boolean;
  content: React.ReactElement;
  close: () => void;
}

const RightBottomModal: React.FC<RightBottomModalProps> = ({
  content,
  isOpen,
  close,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  // Synchronize local `showModal` state with `isOpen` prop
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Close the modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
      setShowModal(false);
    }
  };

  // Toggle the modal state
  const handleToggle = useCallback(() => {
    if (showModal) {
      close();
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [showModal, close]);

  return (
    <div>
      {/* Black arrow button to toggle the modal */}
      {!showModal && (
        <button
        onClick={handleToggle}
        className="fixed bottom-1/2 right-0 translate-y-1/2 bg-black text-white p-1 sm:p-2 text-xs sm:text-sm rounded-l-full shadow-sm focus:outline-none hover:bg-gray-700"
      >
        ▶
      </button>
      

      )}

      {/* Wrapper for outside click */}
      {showModal && (
        <div
          onClick={handleOutsideClick}
          className="fixed inset-0 flex justify-end items-end"
        >
          {/* Modal */}
          <div
            className={`w-full sm:max-w-sm max-w-[50%] bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 transform ${
              showModal ? "translate-y-0" : "translate-y-[100%]"
            }`}
          >
            <div className="flex flex-col items-center border-b p-2 sm:p-4">
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  👋 Hello!
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Welcome to the ChatBot!
                </span>
              </div>
              <button
                className="absolute top-1 sm:top-2 right-1 sm:right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                onClick={handleToggle}
              >
                ×
              </button>
            </div>
            <div className="p-2 sm:p-4 overflow-y-auto max-h-[40vh] sm:max-h-[50vh]">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightBottomModal;
