import React from 'react';

const TypingIndicator = ({ avatar, name }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-xs lg:max-w-md">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="mx-2">
          <div className="inline-block px-4 py-2 rounded-2xl bg-white border border-gray-200 rounded-bl-sm">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {name} is typing...
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;