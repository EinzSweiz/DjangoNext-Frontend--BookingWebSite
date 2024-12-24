"use client";
import React, { useEffect, useState } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions"; // Mock function to get the user ID
import useContactModal from "@/app/hooks/useContactModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useProfileModal from "@/app/hooks/useProfileModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();
  const [answer, setAnswer] = useState<string>(""); // Stores the chatbot's answer
  const [loading, setLoading] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null); // Tracks the current question
  const [showGif, setShowGif] = useState<string | null>(null); // Tracks success GIF visibility
  const [userName, setUserName] = useState<string>("Dear Guest"); // Stores the user name or ID
  const contactModal = useContactModal()
  const loginModal = useLoginModal()
  const profileModal = useProfileModal()

  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start

    // Fetch the user ID or name asynchronously
    const fetchUserId = async () => {
      try {
        const userId = await getUserId();
        console.log('User:', userId)
        setUserName(userId || "Dear Guest");
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (q: string) => {
    setLoading(true); // Show "thinking" animation
    setActiveQuestion(q); // Set the active question
    setAnswer(""); // Clear previous answer
    setShowGif("/success.gif"); // Show success GIF during thinking

    try {
      console.log("Question:", q);

      // Send the request to the API
      const response = await apiService.postWithoutToken(
        "/api/chatbot/",
        JSON.stringify({ question: q }),
        false
      );
      
      if (response.redirect) {
        window.location.href = response.redirect;
      }

      if (response.action) {
        if (response.action === "open_contact_modal") {
                contactModal.open();
            }
      }

      // Simulate a delay before displaying the answer
      setTimeout(() => {
        setAnswer(response.response); // Set the response
        setLoading(false); // Hide the loading state
      }, 2000); // 2-second delay
    } catch (error) {
      console.error("Failed to fetch chatbot response:", error);
      setTimeout(() => {
        setAnswer("Sorry, something went wrong!"); // Display error message
        setLoading(false); // Hide the loading state
      }, 2000); // 2-second delay
    }
  };

  const resetToInitial = () => {
    setActiveQuestion(null); // Reset to initial state
    setAnswer(""); // Clear the previous answer
    setLoading(false); // Ensure loading is stopped
    setShowGif(null); // Reset GIF
  };

  const content = (
    <div className="w-full max-w-sm bg-black text-white border border-gray-700 rounded-lg shadow-lg dark:bg-gray-900">
      <div className="flex flex-col items-center py-6 px-4 space-y-6">
        {showGif && (
          <>
            <img
              src={showGif} // Display success GIF
              alt="Processing"
              className="w-20 h-20 border rounded-full"
            />
            {loading && <p className="text-sm font-semibold text-center">
              I am working on your issue, <span className="text-blue-400">{userName}</span>.
            </p>
            }
            
          </>
        )}
        {activeQuestion && (
          <p className="text-sm font-semibold text-center">
            <span className="text-blue-400 text-lg">Question:</span> {activeQuestion}
          </p>
        )}
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-lg text-white">🤖 Thinking...</span>
          </div>
        ) : (
          <>
            <p className="text-base text-center">
              <span className="text-green-400 font-semibold text-lg">Answer:</span> {answer}
            </p>
            <button
                onClick={resetToInitial}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-sm font-medium rounded-full shadow-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-300 transform hover:scale-105 transition-transform duration-300"
                >
                🔄 Ask More Questions
            </button>
          </>
        )}
      </div>
    </div>
  );

  const initialContent = (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-3 px-3 sm:pb-4 sm:px-4">
        <img
          className="w-16 h-16 mb-2 rounded-full shadow-lg"
          src="/bot_image.jpg"
          alt="ChatBot"
        />
        <h5 className="mb-2 text-lg font-medium text-white dark:text-white">
          ChatBot
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
          How can I assist you today?
        </span>
        <div className="flex flex-col mt-3 space-y-2 w-full">
          <button
            onClick={() => handleSubmit("What is this website about?")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            What is this website about?
          </button>
          <button
            onClick={() => handleSubmit("How do I contact support?")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            How do I contact support?
          </button>
          <button
            onClick={() => handleSubmit("Show me available properties")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show me available properties
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <RightBottomModal
      isOpen={chatbotModal.isOpen}
      close={chatbotModal.close}
      content={activeQuestion ? content : initialContent} // Show appropriate content based on state
    />
  );
};

export default ChatBotModal;
