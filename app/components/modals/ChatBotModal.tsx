"use client";
import React, { useEffect, useState } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import useContactModal from "@/app/hooks/useContactModal";
import useProfileModal from "@/app/hooks/useProfileModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();
  const [questions, setQuestions] = useState<string[]>([]); // Store all questions
  const [answer, setAnswer] = useState<string>(""); // Stores the chatbot's answer
  const [loading, setLoading] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null); // Tracks the current question
  const [showGif, setShowGif] = useState<string | null>(null); // Tracks success GIF visibility
  const [userName, setUserName] = useState<string>("Dear Guest"); // Stores the user name or ID
  const contactModal = useContactModal();
  const profileModal = useProfileModal();
  
  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start
    const fetchUserId = async () => {
      try {
        const userId = await getUserId();
        const response = await apiService.getWithToken(`/api/auth/profile/${userId}/`);
        setUserName(response.name || "Dear Guest");
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await apiService.get("/api/chatbot/questions/");
        setQuestions(response.questions || []);
      } catch (error) {
        console.error("Failed to fetch chatbot questions:", error);
      }
    };

    fetchUserId();
    fetchQuestions();
  }, []);

  const handleSubmit = async (q: string) => {
    setLoading(true);
    setActiveQuestion(q);
    setAnswer("");
    setShowGif("/success.gif");

    try {
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
        } else if (response.action === "open_profile_modal") {
          profileModal.open();
        }
      }

      setTimeout(() => {
        setAnswer(response.response);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to fetch chatbot response:", error);
      setTimeout(() => {
        setAnswer("Sorry, something went wrong!");
        setLoading(false);
      }, 2000);
    }
  };

  const resetToInitial = () => {
    setActiveQuestion(null);
    setAnswer("");
    setLoading(false);
    setShowGif(null);
  };

  const content = (
    <div className="w-full max-w-sm max-h-screen bg-black text-white border border-gray-700 rounded-lg shadow-lg dark:bg-gray-900">
      <div className="flex flex-col items-center py-6 px-4 space-y-6">
        {showGif && (
          <>
            <img src={showGif} alt="Processing" className="w-16 h-16 border rounded-full" />
            {loading && (
              <p className="text-sm font-semibold text-center">
                I am working on your issue, <span className="text-blue-400">{userName}</span>.
              </p>
            )}
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
    <div className="w-full max-w-sm max-h-screen bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-3 px-3 sm:pb-4 sm:px-4">
        <img className="w-16 h-16 mb-2 rounded-full shadow-lg" src="/bot_image.jpg" alt="ChatBot" />
        <h5 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">ChatBot</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
          How can I assist you today?
        </span>
        <div className="flex flex-col mt-3 space-y-2 w-full max-h-64 overflow-y-auto">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSubmit(question)}
              className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <RightBottomModal
      isOpen={chatbotModal.isOpen}
      close={chatbotModal.close}
      content={activeQuestion ? content : initialContent}
    />
  );
};

export default ChatBotModal;
