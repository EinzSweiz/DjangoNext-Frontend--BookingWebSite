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

  // Manage showModal state based on isOpen
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300); // Allow time for animations
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      close();
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [isOpen, close]);

  return (
    <div>
      {/* Arrow button to toggle the modal */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-0 right-0 mb-2 mr-2 bg-blue-700 text-white p-2 rounded-full shadow-lg focus:outline-none hover:bg-blue-800"
        >
          ▲
        </button>
      )}
      {/* Modal */}
      <div
        className={`fixed bottom-0 right-0 h-[30%] max-w-sm w-full bg-white border-l border-gray-200 rounded-t-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <span className="text-lg font-bold text-center">Hello!</span>
          <button
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            onClick={handleToggle}
          >
            ×
          </button>
        </div>
        <div className="p-4">{content}</div>
      </div>
    </div>
  );
};

export default RightBottomModal;
