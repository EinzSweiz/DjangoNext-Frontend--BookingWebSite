"use client";
import React, { useState, useEffect, useCallback } from "react";

interface RightBottomModalProps {
  label: string;
  isOpen: boolean;
  content: React.ReactElement;
  close: () => void;
}

const RightBottomModal: React.FC<RightBottomModalProps> = ({
  label,
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

  const handleClose = useCallback(() => {
    close();
    setShowModal(false);
  }, [close]);

  if (!showModal && !isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full max-w-sm bg-white border-l border-gray-200 rounded-l-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center border-b p-4">
        <span className="text-lg font-bold">{label}</span>
        <button
          className="text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
      <div className="p-4">{content}</div>
    </div>
  );
};

export default RightBottomModal;
