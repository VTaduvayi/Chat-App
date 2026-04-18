import { useState, type FormEvent } from "react";
import styles from "./MessageInput.module.css";

interface MessageInputProps {
  onSend: (message: string, author: string) => Promise<void>;
  isSending: boolean;
}

export function MessageInput({ onSend, isSending }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState(() => {
    return localStorage.getItem("chat-author") ?? "";
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedMessage || !trimmedAuthor) return;

    setError(null);

    try {
      await onSend(trimmedMessage, trimmedAuthor);
      localStorage.setItem("chat-author", trimmedAuthor);
      setMessage("");
    } catch {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <form
      className={styles.inputBar}
      onSubmit={handleSubmit}
      aria-label="Send a message"
    >
      <input
        type="text"
        className={styles.authorInput}
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        required
      />
      <input
        type="text"
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        aria-label="Type your message"
        required
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={isSending || !message.trim() || !author.trim()}
      >
        {isSending ? "Sending…" : "Send"}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
