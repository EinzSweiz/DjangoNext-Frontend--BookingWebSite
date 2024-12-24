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

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!showModal && !isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-end ${
        isOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      onClick={handleOutsideClick}
    >
      <div
        className={`w-full max-w-md bg-white rounded-t-lg shadow-lg p-4 transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-lg font-bold">{label}</span>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        <div className="mt-4">{content}</div>
      </div>
    </div>
  );
};

export default RightBottomModal;
