import { cooks } from "@/data/cooks";
import Image from "next/image";

type ChatMessageProps = {
  content: string;
  role: string;
  id?: string;
};

// Receive detail of interaction from user to Waiter or from user to Cook
export default function ChatMessage({ content, role, id }: ChatMessageProps) {
  if (role === "system") return null;

  let avatarSrc = "";
  let altText = "";
  let messageClasses = "";
  let avatarClasses = "";

  // Branch user
  if (role === "user") {
    avatarSrc = "/avatars/user.png";
    altText = "user";
    messageClasses = "message-user";
    avatarClasses = "user-avatar";
    // Branch Cook
  } else if (role === "cook" && id) {
    const selectedCook = cooks.find((cook) => cook.id === id);
    if (!selectedCook) return null;
    avatarSrc = selectedCook.avatar;
    altText = selectedCook.name;
    messageClasses = "message-cook";
    avatarClasses = "cook-avatar";
  } else {
    // Branch waiter
    avatarSrc = "/avatars/waiterAi.png";
    altText = "waiter";
    messageClasses = "message-waiter";
    avatarClasses = "waiter-avatar";
  }

  const rowAlign =
    role === "user" ? "flex-row-reverse items-start" : "items-start";

  return (
    <div className={`flex !gap-1 md:!gap-3 ${rowAlign}`}>
      <div className="shrink-0 avatar-container">
        <Image
          src={avatarSrc}
          alt={altText}
          width={80}
          height={80}
          className={`${avatarClasses} rounded-full object-cover align-top`}
        />
      </div>

      <div className={`${messageClasses} max-w-[70%] self-start`}>
        <p className="text-sm md:text-base lg:text-lg font-medium leading-none whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
