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
      className={`right-bottom-modal-backdrop ${isOpen ? "open" : "close"}`}
      onClick={handleOutsideClick}
    >
      <div className="right-bottom-modal">
        <div className="modal-header">
          <span>{label}</span>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-content">{content}</div>
      </div>
    </div>
  );
};

export default RightBottomModal;
