"use client";
import React, { useEffect, useState } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import useContactModal from "@/app/hooks/useContactModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useProfileModal from "@/app/hooks/useProfileModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();
  const [questions, setQuestions] = useState<string[]>([]); // Store all questions
  const [answer, setAnswer] = useState<string>(""); // Stores the chatbot's answer
  const [loading, setLoading] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null); // Tracks the current question
  const [showGif, setShowGif] = useState<string | null>(null); // Tracks success GIF visibility
  const [userName, setUserName] = useState<string>("Dear Guest"); // Stores the user name
  const [userid, setUserId] = useState<string>('');
  const contactModal = useContactModal();
  const profileModal = useProfileModal();
  const loginModal = useLoginModal()

  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start

    const fetchUserId = async () => {
      try {
        const userId = await getUserId();
        if (userId) {
            setUserId(userId)
        }
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
        if (userid){
            setTimeout(() => window.location.href = response.redirect, 7500);
        } else {
            setTimeout(() => loginModal.open(), 7500);
        }
        

      }

      
      if (response.action) {
        if (response.action === "open_contact_modal") {
            if (userid){
                setTimeout(() => contactModal.open(), 7500);
        } else {
            setTimeout(() => loginModal.open(), 7500);
        }
        } else if (response.action === "open_profile_modal") {
            if (userid){
                setTimeout(() => profileModal.open(), 7500);
        } else {
            setTimeout(() => loginModal.open(), 7500);
        }
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
    <div className="w-full max-w-sm bg-black text-white border border-gray-700 rounded-lg shadow-lg dark:bg-gray-900 flex flex-col" style={{ height: "85%" }}>
      <div className="flex-1 flex flex-col items-center py-4 px-4 space-y-3 overflow-y-auto">
        {showGif && (
          <>
            <img src={showGif} alt="Processing" className="w-16 h-16 border rounded-full" />
            {loading && (
              <p className="text-xs font-semibold text-center">
                I am working on your issue, <span className="text-blue-400">{userName}</span>.
              </p>
            )}
          </>
        )}
        {activeQuestion && (
          <p className="text-sm font-semibold text-center">
            <span className="text-blue-400">Question:</span> {activeQuestion}
          </p>
        )}
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-2 text-xs text-white">🤖 Thinking...</span>
          </div>
        ) : (
          <p className="text-sm text-center">
            <span className="text-green-400 font-semibold">Answer:</span> {answer}
          </p>
        )}
      </div>
      {!loading && (
        <div className="sticky bottom-0 w-full bg-black py-2 px-4">
          <button
            onClick={resetToInitial}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-xs font-medium rounded-full shadow-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-300 transform hover:scale-105 transition-transform duration-300"
          >
            🔄 Ask More Questions
          </button>
        </div>
      )}
    </div>
  );

  const initialContent = (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col" style={{ height: "85%" }}>
      <div className="flex-1 flex flex-col items-center pb-3 px-3 sm:pb-4 sm:px-4 overflow-y-auto">
        <img className="w-12 h-12 mb-2 rounded-full shadow-lg" src="/bot_image.jpg" alt="ChatBot" />
        <h5 className="mb-2 text-xs font-medium text-gray-900 dark:text-white">ChatBot</h5>
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <span className="text-blue-400">{userName.charAt(0).toUpperCase() + userName.slice(1)}</span> how can I assist you today?
        </span>
        <div className="flex flex-col mt-2 space-y-2 w-full max-h-60 overflow-y-auto">
        {questions.map((question, index) => (
            <button
                key={index}
                onClick={() => handleSubmit(question)}
                className="w-full px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:via-blue-500 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
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
