import { useEffect, useState, useCallback, useRef } from "react";
import { fetchMessages, sendMessage } from "@/lib/api";
import type { Message } from "@/types";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { MessageInput } from "@/features/chat/components/MessageInput";
import styles from "./App.module.css";

const CURRENT_USER = localStorage.getItem("chat-author") ?? "";

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages()
      .then((data) => {
        setMessages(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (message: string, author: string) => {
    setIsSending(true);
    try {
      const newMessage = await sendMessage(message, author);
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setIsSending(false);
    }
  }, []);

  const currentAuthor = localStorage.getItem("chat-author") ?? "";

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
