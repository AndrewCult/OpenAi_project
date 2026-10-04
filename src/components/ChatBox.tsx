"use client";

import { useEffect, useState, useRef } from "react";
import { Session, WaiterState } from "@/lib/switchWaiterState";
import useInitSession from "@/hooks/useInitSession";
import ChatHistory from "@/components/ChatHistory";
import WaiterWaitingState from "@/components/WaiterWaitingState";
import {
  getInitialWaiterValue,
  sendWaiterMessage,
} from "@/lib/waiterApiClient";
import {
  getInitialCookValue,
  initCookSession,
  sendCookMessage,
} from "@/lib/cookApiClient";
import { CookSession } from "@/lib/switchCookState";
import CookSelectionModal from "@/components/CookSelectionModal";
import InputChatBox from "@/components/InputChatBox";
import { useCustomerStats } from "@/context/CustomerStatsContext";
import { unlockAudio } from "@/lib/holdMusic";

export default function ChatBox() {
  // useState management -> WaiterSession, CookSession, recipe, cookChat, ChatHistory and isSending(user message sending)
  const [waiterSession, setWaiterSession] = useState<Session>(
    getInitialWaiterValue(),
  );
  const { sessionInit, error } = useInitSession(waiterSession, "api/waiter");
  const [cookSession, setCookSession] = useState<CookSession>(
    getInitialCookValue("", ""),
  );
  const [recipe, setRecipe] = useState("");
  const [cookChat, setCookChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessages[]>([]);
  const [isSending, setIsSending] = useState(false); // user message state of sending to api, it should prevent spam from user

  const {
    setRecipe: setStatsRecipe,
    addConsultedCook,
    addWaitingTime,
  } = useCustomerStats();
  const sendMessage = async (input: string) => {
    if (isSending) return;
    setIsSending(true);
    const sentAt = Date.now();

    const userInput = { role: "user", content: input };
    addHistoryMessage(userInput);

    let returnedSession = null;

    try {
      if (!cookChat) {
        returnedSession = await sendWaiterMessage(
          input,
          waiterSession,
          setWaiterSession,
        );

        if (returnedSession != null) {
          /* addHistoryMessage(
          returnedSession.history[returnedSession.history.length - 1]
        ); */
          setChatHistory(returnedSession.history);
        }
      } else if (cookChat && cookSession.cookID.trim() !== "") {
        returnedSession = await sendCookMessage(
          input,
          cookSession,
          setCookSession,
        );

        if (returnedSession != null) {
          addHistoryMessage({
            ...returnedSession.history[returnedSession.history.length - 1],
            id: cookSession.cookID,
          });
        }
      }
    } catch (err) {
      console.error(err);
      addHistoryMessage({
        role: "assistant",
        content:
          "Something went wrong talking to the server. Please try again.",
      });
    } finally {
      setIsSending(false);
      addWaitingTime(Date.now() - sentAt);
    }
  };

  // Modal variables
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);
  const [failText, setFailText] = useState("");
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);

  // Single scroll ref for the actual scrollable container
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,

          behavior: "smooth",
        });
      }, 100);
    }
  }, [chatHistory]);

  // useEffect management
  useEffect(() => {
    if (sessionInit && !error) {
      setWaiterSession(sessionInit);
      addHistoryMessage(sessionInit.history[sessionInit.history.length - 1]);
    }
    if (error) {
      addHistoryMessage({
        role: "assistant",
        content:
          "The waiter is unreacheable right now (server error). Please try again later.",
      });
    }
  }, [sessionInit, error]);

  const addHistoryMessage = (message: ChatHistoryMessages): void => {
    setChatHistory((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (waiterSession?.recipe) {
      setRecipe(waiterSession.recipe);
      setStatsRecipe(waiterSession.recipe);
    }
  }, [waiterSession, setStatsRecipe]);

  // Return to waiter from cookChat finished
  useEffect(() => {
    if (cookSession.step === "RETURN_TO_WAITER") {
      setCookChat(false);
      setCookSession(getInitialCookValue("", ""));

      (async () => {
        waiterSession.step = "RETURN_TO_WAITER" as WaiterState;
        let returnedSession = null;
        returnedSession = await sendWaiterMessage(
          " ",
          waiterSession,
          setWaiterSession,
        );
        if (returnedSession != null) {
          addHistoryMessage(
            returnedSession.history[returnedSession.history.length - 1],
          );
        }
      })();
    }
  }, [cookSession.step, waiterSession]);

  const startCookCommunication = async (cookID: string) => {
    const returnedSession = await initCookSession(
      cookID,
      recipe,
      setCookSession,
    );

    setWaiterSession((prev) => ({ ...prev, proposedCooks: undefined }));
    setWaiterSession((prev) => ({
      ...prev,
      usedCooksID: [...(prev.usedCooksID ?? []), { id: cookID }],
    }));

    if (returnedSession && returnedSession.history.length > 0) {
      const lastMessage =
        returnedSession.history[returnedSession.history.length - 1];
      addHistoryMessage({ ...lastMessage, id: cookID });
    }

    setCookChat(true);
    addConsultedCook(cookID);

    return cookID;
  };

  // If proposedCook exist open Modal
  useEffect(() => {
    if (
      waiterSession?.proposedCooks &&
      waiterSession.proposedCooks.length > 0 &&
      !isWaiterModalOpen
    ) {
      const timeout = setTimeout(() => {
        setIsCookModalOpen(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [waiterSession?.proposedCooks, isWaiterModalOpen]);

  return (
    <div className="chat-container relative w-full max-w-5xl flex flex-col h-full p-6">
      <div className="flex-1 min-h-0 flex flex-col">
        <div ref={scrollRef} className="chat-scroll hide-scrollbar">
          <ChatHistory history={chatHistory ? chatHistory : []} />
        </div>

        <div className="sticky bottom-0 pt-3 bg-transparent">
          <InputChatBox
            sendMessage={sendMessage}
            disabled={
              isSending ||
              isCookModalOpen ||
              (waiterSession?.proposedCooks?.length ?? 0) > 0
            }
          />
        </div>
      </div>

      <WaiterWaitingState
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
      />

      {isSending && (
        <div className="flex items-center gap-2 text-gray-500 italic p-2">
          <span>
            {cookChat
              ? "👨‍🍳 The cook is thinking..."
              : "🤵 The waiter is thinking..."}
          </span>
        </div>
      )}

      {isCookModalOpen && waiterSession?.proposedCooks && (
        <CookSelectionModal
          isOpen={isCookModalOpen}
          cooks={waiterSession.proposedCooks}
          failText={failText}
          onFail={() => setFailText("You need to select a cook to proceed!!!")}
          onSelect={async (id) => {
            unlockAudio(); // must run inside the tap, before any wait/setTimeout (mobile autoplay rules)
            setIsCookModalOpen(false);
            setIsWaiterModalOpen(true);
            const selectedAt = Date.now();
            setTimeout(async () => {
              await startCookCommunication(id);
              addWaitingTime(Date.now() - selectedAt);
            }, 7000);
          }}
        />
      )}
    </div>
  );
}

export interface ChatHistoryMessages {
  role: string;
  content: string;
  id?: string;
}
