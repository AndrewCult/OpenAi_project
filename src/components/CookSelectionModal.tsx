import Modal from "./Modal";
import Image from "next/image";
import { Cook } from "@/data/cooks";

interface CookSelectionModalProps {
  isOpen: boolean;
  cooks: Cook[];
  failText?: string;
  onClose?: () => void;
  onFail: () => void;
  onSelect: (cookId: string) => Promise<void> | void;
}

export default function CookSelectionModal({
  isOpen,
  cooks,
  failText,
  onClose,
  onFail,
  onSelect,
}: CookSelectionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onFail={onFail}>
      <div className="modal-box flex flex-col items-center text-center p-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 gradient-text">
          These are the chefs available at the moment...
        </h2>
        <p className="text-red-600 font-semibold mb-8 text-md md:text-lg lg:text-xl">
          Which chef would you like to get in touch with?
        </p>

        <div className="flex flex-wrap justify-center gap-1 md:!gap-5 cook-card-container w-full">
          {cooks.map((cook, i) => (
            <div
              key={i}
              className="cook-card w-[220px] sm:w-[240px] md:w-[260px] grow-0 shrink-0"
              onClick={() => onSelect(cook.id)}
            >
              <div className=" mb-4">
                <Image
                  src={cook.avatar}
                  alt={cook.name}
                  width={100}
                  height={100}
                  className="rounded-full cook-card-avatar"
                />
              </div>
              <p className="cook-name mb-1 md:mb-3">{cook.name}</p>
              <div className="cook-details">
                <div className="cook-detail-item">
                  <span className="cook-detail-label">Origin:</span>
                  {cook.origin}
                </div>
                <div>
                  <span className="cook-detail-label">Cuisine:</span>
                  {cook.cuisine}
                </div>
              </div>
            </div>
          ))}
        </div>

        {failText !== "" && (
          <div className="fail-message mt-6">🤌 {failText} 🤌</div>
        )}
      </div>
    </Modal>
  );
}
