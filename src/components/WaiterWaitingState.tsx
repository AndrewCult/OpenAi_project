import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { startHoldMusic, HoldMusic } from "@/lib/holdMusic";

const WAITING_TIME_MS = 10000;

interface WaiterWaitingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaiterWaitingState({
  isOpen,
  onClose,
}: WaiterWaitingProps) {
  // Survives between waits, because this component stays mounted (Modal just renders null)
  const [muted, setMuted] = useState(false);
  const musicRef = useRef<HoldMusic | null>(null);
  const mutedRef = useRef(muted);
  // Keep the latest onClose without restarting the timer: the parent passes a new
  // arrow function on every render, which would otherwise reset the countdown
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // While open: play hold music and close automatically after the waiting time
  useEffect(() => {
    if (!isOpen) return;

    const music = startHoldMusic(mutedRef.current);
    musicRef.current = music;
    const timer = setTimeout(() => onCloseRef.current(), WAITING_TIME_MS);

    return () => {
      clearTimeout(timer);
      music.stop();
      musicRef.current = null;
    };
  }, [isOpen]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    musicRef.current?.setMuted(next);
  };

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
        <div className="flex flex-col items-center text-center p-8">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Please, stay on the line!!!
          </h2>

          <p className="text-red-600 font-semibold mb-8 text-lg">
            I’ll get in touch with the chef you chose...
          </p>

          <div className="loadership_GRTSL">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="!mt-6 !px-4 !py-1 rounded-full border border-gray-300 text-gray-600 text-sm hover:border-red-400 hover:text-red-500 transition-colors"
          >
            {muted ? "🔈 Unmute hold music" : "🔇 Mute hold music"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
