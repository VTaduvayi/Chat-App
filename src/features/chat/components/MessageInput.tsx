import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
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
  const [shake, setShake] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedAuthor) {
      setShake(true);
      authorInputRef.current?.focus();
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!trimmedMessage) return;

    setError(null);

    try {
      await onSend(trimmedMessage, trimmedAuthor);
      localStorage.setItem("chat-author", trimmedAuthor);
      setMessage("");
      messageInputRef.current?.focus();
    } catch {
      if (!/^[a-zA-Z0-9]+$/.test(trimmedAuthor)) {
        setError(
          "Username must contain only alphanumeric characters (A–Z, a–z, 0–9).",
        );
      } else {
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      className={styles.inputBar}
      onSubmit={handleSubmit}
      aria-label="Send a message"
      noValidate
    >
      {error && (
        <div className={styles.errorHint} aria-live="polite">
          {error}
        </div>
      )}
      <div className={styles.inputRow}>
        <label htmlFor="author-input" className={styles.srOnly}>
          Your name
        </label>
        <input
          id="author-input"
          ref={authorInputRef}
          type="text"
          className={`${styles.authorInput} ${shake ? styles.shake : ""}`}
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Your username"
          autoComplete="name"
        />
        <label htmlFor="message-input" className={styles.srOnly}>
          Type your message
        </label>
        <input
          id="message-input"
          ref={messageInputRef}
          type="text"
          className={styles.messageInput}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          autoComplete="off"
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isSending || !message.trim()}
          aria-busy={isSending}
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
