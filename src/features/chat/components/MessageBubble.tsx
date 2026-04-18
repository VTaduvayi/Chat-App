import type { Message } from "../types";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formattedDate = new Date(message.createdAt).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <article className={styles.bubble}>
      <span className={styles.author}>{message.author}</span>
      <p className={styles.body}>{message.message}</p>
      <time dateTime={message.createdAt} className={styles.timestamp}>
        {formattedDate}
      </time>
    </article>
  );
}
