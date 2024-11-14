import React from "react";

export const TypingIndicator: React.FC = () => (
  <div className="self-start p-6 bg-gray-900 rounded-lg">
    <div className="flex gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  </div>
);
