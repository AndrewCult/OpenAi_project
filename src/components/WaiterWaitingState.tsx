import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const WAITING_TIME_MS = 10000;
const PHRASE_INTERVAL_MS = 2600;
const QUEUE_INTERVAL_MS = 1700;
const FADE_MS = 300;

const PHRASES = [
    "Your call is important to us.",
    "The chef is currently tasting the sauce.",
    "Your recipe is being lost as we speak.",
    "All our chefs are busy pretending to cook.",
    "This call may be recorded and laughed at for training purposes.",
    "The chef will be with you shortly. Shortly is a relative concept.",
];

interface WaiterWaitingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaiterWaitingState({
  isOpen,
  onClose,
}: WaiterWaitingProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);
  const [queuePosition, setQueuePosition] = useState(3);
  // Keep the latest onClose without restarting the timers: the parent passes a new arrow function on every render, which would otherwise reset the countdown
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // While open: play hold music and close automatically after the waiting time
  useEffect(() => {
    if (!isOpen) return;

    setPhraseIndex(Math.floor(Math.random() * PHRASES.length));
    setPhraseVisible(true);
    setQueuePosition(3);

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Fade out, swap the text, fade back in
    const phraseTimer = setInterval(() => {
      setPhraseVisible(false);
      timeouts.push(
        setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % PHRASES.length);
          setPhraseVisible(true);
        }, FADE_MS)
      );
    }, PHRASE_INTERVAL_MS);

    // The joke: the queue position goes UP
    const queueTimer = setInterval(() => {
      setQueuePosition((p) => p + 1 + Math.floor(Math.random() * 3));
    }, QUEUE_INTERVAL_MS);

    const closeTimer = setTimeout(() => onCloseRef.current(), WAITING_TIME_MS);

    return () => {
      clearInterval(phraseTimer);
      clearInterval(queueTimer);
      clearTimeout(closeTimer);
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col flex-wrap items-center justify-center gap-8 cook-card-container w-full">
        <div className="cook-avatar">
          <Image
            src="/avatars/waiterAi.png"
            alt="Waiter Ai"
            width={200}
            height={100}
          />
        </div>
        <div className="flex flex-col items-center text-center !p-8">
          <h2 className="text-3xl font-bold !mb-4 gradient-text">
            Please, stay on the line!!!
          </h2>

          <p className="text-red-600 font-semibold !mb-8 text-lg">
            I’ll get in touch with the chef you chose...
          </p>

          <div className="loadership_GRTSL">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* aria-live: screen readers announce each new caption */}
          <p
            aria-live="polite"
            className={`!mt-8 min-h-[3.5rem] max-w-sm italic text-gray-600 transition-opacity duration-300 ${
              phraseVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            “{PHRASES[phraseIndex]}”
          </p>

          <p className="!mt-2 text-sm text-gray-500">
            Your position in the queue:{" "}
            <span key={queuePosition} className="queue-bump font-bold text-red-500">
              {queuePosition}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
