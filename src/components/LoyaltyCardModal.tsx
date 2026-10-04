"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "./Modal";
import { cooks } from "@/data/cooks";
import { useCustomerStats } from "@/context/CustomerStatsContext";

const LEVELS = [
  { min: 0, label: "Curious Guest 🥄" },
  { min: 1, label: "Patient Guest 🥉" },
  { min: 2, label: "Stubborn Guest 🥈" },
  { min: 3, label: "Saint of the Dining Room 🥇" },
  { min: 5, label: "Living Legend of Waiting 🏆" },
];

const REWARDS = [
  "A fork. Maybe.",
  "One (1) breadstick, slightly used.",
  "A photo of a tiramisu.",
  "Priority access to the waiting line.",
  "A recipe. Just kidding.",
  "The chef's autograph (on a napkin, illegible).",
];

const GIVE_UP_AFTER = 5;

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

interface LoyaltyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoyaltyCardModal({
  isOpen,
  onClose,
}: LoyaltyCardModalProps) {
  const { recipe, consultedCookIds, waitingMs } = useCustomerStats();
  // Lazy initializers: computed once per page load, so they stay stable while the card is reopened
  const [memberId] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [reward] = useState(
    () => REWARDS[Math.floor(Math.random() * REWARDS.length)],
  );
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);

  const level = [...LEVELS]
    .reverse()
    .find((l) => consultedCookIds.length >= l.min)!;
  const consultedCooks = consultedCookIds
    .map((id) => cooks.find((c) => c.id === id))
    .filter((c) => c !== undefined);
  const gaveUp = attempts >= GIVE_UP_AFTER;

  // The redeem button runs away from the mouse; after a few tries the bistrò confesses
  const dodge = () => {
    if (gaveUp) return;
    const next = attempts + 1;
    setAttempts(next);
    // On the last attempt the button goes back home, so it doesn't cover the final message
    setButtonOffset(
      next >= GIVE_UP_AFTER
        ? { x: 0, y: 0 }
        : { x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 80 },
    );
  };

  return (
    <Modal isOpen={isOpen} onFail={onClose}>
      <div className="flex flex-col items-center text-center !px-6 !pb-6 !pt-10 md:!px-10 md:!pb-8 gap-5 w-full max-w-md !mx-auto">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">
            Loyalty Card
          </h2>
          <p className="text-gray-500 text-sm">
            SummerCamp Bistrò · Valued Guest #{memberId}
          </p>
        </div>

        <dl className="w-full grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-left">
          <dt className="font-semibold text-gray-600">Level</dt>
          <dd>{level.label}</dd>

          <dt className="font-semibold text-gray-600">Requested recipe</dt>
          <dd>{recipe || "Still deciding…"}</dd>

          <dt className="font-semibold text-gray-600">Recipes obtained</dt>
          <dd>0 / ∞</dd>

          <dt className="font-semibold text-gray-600">Chefs consulted</dt>
          <dd className="flex items-center gap-1 flex-wrap">
            <span className="!mr-1">{consultedCooks.length}</span>
            {consultedCooks.map((cook) => (
              <Image
                key={cook.id}
                src={cook.avatar}
                alt={cook.name}
                title={cook.name}
                width={28}
                height={28}
                className="rounded-full"
              />
            ))}
          </dd>

          <dt className="font-semibold text-gray-600">Time spent waiting</dt>
          <dd>{formatDuration(waitingMs)}</dd>

          <dt className="font-semibold text-gray-600">Next reward</dt>
          <dd>{reward}</dd>
        </dl>

        <button
          type="button"
          onMouseEnter={dodge}
          onClick={dodge}
          style={{
            transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
          }}
          className="!mt-2 !px-6 !py-2 rounded-full bg-red-500 text-white font-semibold transition-transform duration-200"
        >
          Redeem reward
        </button>

        {gaveUp && (
          <p className="text-red-600 font-semibold">
            Rewards are temporarily out of stock. Since 1987.
          </p>
        )}
      </div>
    </Modal>
  );
}
