import { memo } from "react";
import type { Message } from "@/types";
import { decodeHtml } from "@/utils/decodeHtml";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isSelf,
}: MessageBubbleProps) {
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
    <article
      className={`${styles.bubble} ${isSelf ? styles.self : styles.other}`}
    >
      {!isSelf && (
        <span className={styles.author}>{decodeHtml(message.author)}</span>
      )}
      <p className={styles.body}>{decodeHtml(message.message)}</p>
      <time dateTime={message.createdAt} className={styles.timestamp}>
        {formattedDate}
      </time>
    </article>
  );
});
