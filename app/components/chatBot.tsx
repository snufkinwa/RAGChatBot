import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "./types";
import { ChatMessage } from "./chatMessage";
import { ChatInput } from "./chatInput";
import { TypingIndicator } from "./typingIndicator";
import { RAGChainManager } from "../utils/ragChain";
import { Menu, X, Settings } from "lucide-react";

export const RagChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ragChainRef = useRef<RAGChainManager | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (process.env.API_KEY && !ragChainRef.current) {
      ragChainRef.current = new RAGChainManager(process.env.API_KEY);
      setIsInitialized(true);
    } else if (!process.env.API_KEY) {
      console.warn("API key is missing. Please check your .env file.");
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!ragChainRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Please initialize the chatbot first.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await ragChainRef.current.query(text);
      const botMessage: Message = {
        id: uuidv4(),
        text: response.content,
        sender: "bot",
        timestamp: new Date(),
        sources: response.sources,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-gray-800 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-white">Chat History</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-gray-700 rounded text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat history can be added here */}
        </div>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full p-2 flex items-center gap-2 hover:bg-gray-700 rounded text-white">
            <Settings size={20} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex-none p-4 bg-gray-900 text-white border-b border-gray-700 flex items-center">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 hover:bg-gray-800 rounded mr-4"
            >
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-semibold">RAG Chatbot</h1>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-none p-4 border-t border-gray-700">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
