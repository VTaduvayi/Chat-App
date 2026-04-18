import type { Message } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? "super-secret-doodle-token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // response body wasn't JSON — use the default message
    }

    throw new ApiError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchMessages(limit = 50): Promise<Message[]> {
  return request<Message[]>(`/messages?limit=${limit}`);
}

export async function sendMessage(
  message: string,
  author: string,
): Promise<Message> {
  return request<Message>("/messages", {
    method: "POST",
    body: JSON.stringify({ message, author }),
  });
}
