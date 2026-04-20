import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchMessages, sendMessage, ApiError } from "./api";

const mockFetch = vi.fn();

describe("API", () => {
  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchMessages", () => {
    it("fetches messages successfully", async () => {
      const mockMessages = [
        {
          _id: "1",
          message: "Hello",
          author: "Alice",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      });

      const result = await fetchMessages();
      expect(result).toEqual(mockMessages);
    });

    it("throws ApiError on failed request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: async () => ({ message: "Internal error" }),
      });

      await expect(fetchMessages()).rejects.toThrow(ApiError);
    });
  });

  describe("sendMessage", () => {
    it("sends a message successfully", async () => {
      const mockMessage = {
        _id: "2",
        message: "Test",
        author: "Bob",
        createdAt: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      });

      const result = await sendMessage("Test", "Bob");
      expect(result).toEqual(mockMessage);
    });
  });
});
