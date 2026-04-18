import { useEffect, useState } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "@/components/MessageBubble";
import styles from "./App.module.css";
import { fetchMessages } from "@/lib/api";

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
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
  );
}
