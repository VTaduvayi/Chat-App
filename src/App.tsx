import { useEffect, useState, useCallback } from "react";
import { fetchMessages, sendMessage } from "@/lib/api";
import type { Message } from "@/types";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageInput } from "@/components/MessageInput";
import styles from "./App.module.css";

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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

  const handleSend = useCallback(async (message: string, author: string) => {
    setIsSending(true);
    try {
      const newMessage = await sendMessage(message, author);
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setIsSending(false);
    }
  }, []);

  return (
    <div className={styles.layout}>
      <main className={styles.chat}>
        <h1 className={styles.heading}>Chat</h1>

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
            <li key={msg._id} className={styles.messageItem}>
              <MessageBubble message={msg} />
            </li>
          ))}
        </ul>
      </main>

      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
