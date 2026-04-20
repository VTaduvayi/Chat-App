# 💬 Chat Application (Frontend Challenge)

A responsive chat interface built with **React + TypeScript + Vite**, implementing message fetching, sending, validation, and accessibility best practices.

---

## 🚀 Features

### Core Functionality

* Fetch and display chat messages from API
* Send messages with author name
* Polling-based updates (every 3 seconds)
* Retry mechanism on API failure

### UX & Accessibility

* Validation for author and message fields
* Inline error hints (no layout shift / clipping issues)
* Keyboard-friendly (Enter to send)
* Screen reader support (`aria-live`, `role="alert"`, labels)
* Auto-scroll to latest message (only when new messages arrive)

### Responsive Design

* Mobile-friendly layout
* Adaptive validation hints (no overflow on small screens)
* Desktop-centered layout with max width

### Performance Considerations

* Polling pauses when tab is inactive (`visibilitychange`)
* Avoids unnecessary re-renders
* Efficient state updates

---

## 🧠 Architecture

The project follows a **feature-based structure**:

```
src/
  features/chat/
    components/
      MessageInput.tsx
      MessageBubble.tsx
    api/
      api.ts
    types/
  App.tsx
```

### Key Decisions

* **Feature-based structure** → scalable and maintainable
* **Centralized API layer** → reusable and testable
* **Controlled components** → predictable form behavior
* **Minimal abstraction** → avoids overengineering

---

## 🔌 API Integration

* Uses `fetch` with a centralized request helper
* Handles:

  * authentication headers
  * error parsing (`ApiError`)
  * JSON response typing

### Supported endpoints:

* `GET /messages`
* `POST /messages`

---

## ⚠️ Error Handling

* API errors surfaced to UI
* Retry option for failed fetch
* Input validation prevents invalid submissions
* Message input preserved on failure

---

## 🧪 Testing

Basic API tests implemented using **Vitest**:

* fetchMessages success + failure
* sendMessage success

These tests validate:

* correct API behavior
* error handling via `ApiError`

---

## 📱 Responsiveness Strategy

* Mobile-first approach
* Breakpoint at `768px`
* Validation hints adapt:

  * Desktop → tooltip style
  * Mobile → wrapped, non-overflowing

---

## ⚡ Performance Decisions

Instead of overengineering (pagination/virtualization), the app focuses on:

* efficient polling
* visibility-based optimization
* minimal DOM updates

### Future Improvements

* Pagination using `after` cursortek
* Virtualized message list for large datasets
* WebSocket-based real-time updates

---

## 🛠️ Setup & Run

```bash
# install dependencies
npm install

# run development server
npm run dev

# run tests
npm run test
```

---

## 📝 Notes

* This implementation prioritizes **clarity, UX, and maintainability**
* Trade-offs were made to avoid unnecessary complexity within the given time constraints

---

