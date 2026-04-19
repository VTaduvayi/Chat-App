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
  const shouldScrollRef = useRef(true);

  const scrollToBottom = () => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (message: string, author: string) => {
    setIsSending(true);
    shouldScrollRef.current = true;
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
      <main className={styles.chat}>
        {isLoading && <p className={styles.status}>Loading messages…</p>}

        {error && (
          <p role="alert" className={styles.error}>
            Failed to load messages: {error}
          </p>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <p className={styles.status}>No messages yet.</p>
        )}

        <ul className={styles.messageList} aria-label="Chat messages">
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
