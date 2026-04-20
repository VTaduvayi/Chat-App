import { useEffect, useState, useCallback, useRef } from "react";
import { fetchMessages, sendMessage } from "@/lib/api";
import type { Message } from "@/types";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { MessageInput } from "@/features/chat/components/MessageInput";
import styles from "./App.module.css";

const POLL_INTERVAL = 3000;

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(
    () => localStorage.getItem("chat-author") ?? "",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);
  const lastMessageDateRef = useRef<string | undefined>(undefined);

  const loadMessages = useCallback(async (after?: string) => {
    try {
      const data = await fetchMessages(50, after);
      if (after) {
        // Incremental: append only new messages
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const newMessages = data.filter((m) => !existingIds.has(m._id));
          return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
        });
      } else {
        // Initial load: replace all
        setMessages(data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Track latest message date for incremental polling
  useEffect(() => {
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      if (latest) {
        lastMessageDateRef.current = latest.createdAt;
      }
    }
  }, [messages]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const startPolling = () => {
      if (!lastMessageDateRef.current) {
        loadMessages();
      } else {
        loadMessages(lastMessageDateRef.current);
      }
      interval = setInterval(() => {
        loadMessages(lastMessageDateRef.current);
      }, POLL_INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(interval);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadMessages]);

  useEffect(() => {
    if (messageCountRef.current < messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    messageCountRef.current = messages.length;
  }, [messages]);

  const handleSend = useCallback(async (message: string, author: string) => {
    setIsSending(true);
    try {
      const newMessage = await sendMessage(message, author);
      setMessages((prev) => [...prev, newMessage]);
      setCurrentAuthor(author);
    } finally {
      setIsSending(false);
    }
  }, []);

  return (
    <div className={styles.layout}>
      <main className={styles.chat} role="main" aria-label="Chat messages">
        {isLoading && (
          <p className={styles.status} role="status">
            Loading messages…
          </p>
        )}

        {error && (
          <div role="alert" className={styles.error}>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => loadMessages()}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <p className={styles.status} role="status">
            No messages yet. Start the conversation!
          </p>
        )}

        <ul
          className={styles.messageList}
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`${styles.messageItem} ${
                msg.author === currentAuthor ? styles.selfItem : ""
              }`}
            >
              <MessageBubble
                message={msg}
                isSelf={msg.author === currentAuthor}
              />
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} aria-hidden="true" />
      </main>

      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
