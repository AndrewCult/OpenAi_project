import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

type InputChatBoxProps = {
  sendMessage: (input: string) => void;
  disabled?: boolean;
};

export default function InputChatBox({
  sendMessage,
  disabled = false,
}: InputChatBoxProps) {
  const [userInput, setUserInput] = useState("");

  return (
    <form
      className="
        input-container"
    >
      <input
        type="text"
        value={userInput}
        maxLength={300} // same limit as the server (LIMITS.maxUserMessageChars)
        onChange={({ target }) => setUserInput(target.value)}
        className="input-field"
        placeholder={
          disabled ? "⚠️ Wait a minute..." : "Type your message here... 🍳"
        }
        readOnly={disabled}
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (userInput.trim() !== "" && !disabled) {
            sendMessage(userInput);
            setUserInput("");
          }
        }}
        className={`send-button
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-400/50 hover:bg-red-400"
          }
        `}
        disabled={disabled}
      >
        <FaTelegramPlane size={20} />
      </button>
    </form>
  );
}
