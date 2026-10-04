"use client";

import { useState } from "react";
import LoyaltyCardModal from "./LoyaltyCardModal";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="profile-icon"
        aria-label="Open your loyalty card"
        onClick={() => setIsOpen(true)}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="profile-svg"
        >
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      <LoyaltyCardModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
