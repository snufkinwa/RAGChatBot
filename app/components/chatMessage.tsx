import React from "react";
import { Message } from "./types";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-8`}
    >
      <div
        className={`max-w-[80%] relative p-4 rounded-lg ${
          isUser ? "bg-gray-800" : "bg-gray-800"
        }`}
      >
        <ReactMarkdown className="leading-relaxed text-white">
          {message.text}
        </ReactMarkdown>
        {message.sources && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 font-medium">Sources:</p>
            <ul className="mt-1 text-xs text-gray-400">
              {message.sources.map((source, index) => (
                <li key={index} className="truncate">
                  {source}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};
