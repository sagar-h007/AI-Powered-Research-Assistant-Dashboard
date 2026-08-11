# AI-Powered Research Assistant Dashboard - Engineering Tradeoffs

This document outlines the core technical decisions, architecture choices, and the rationale behind them for the AI-Powered Research Assistant Dashboard. It is intended to demonstrate a senior-level understanding of MERN stack design principles, focusing on scalability, performance, and maintainability.

## 1. State Management: Context API vs. Redux

**Decision:** We chose the **Context API** combined with localized component state, rather than introducing **Redux**.

**Tradeoffs & Rationale:**
- **Why Context API?** 
  - *Simplicity & Bundle Size:* Context is built into React. For an application of this scope, managing global state (like user authentication status and UI themes) doesn't warrant the boilerplate and bundle size overhead of Redux.
  - *Separation of Concerns:* We treat UI state (theme, modals) and Auth state as global (via Context), while keeping server data state localized to the components that need it (or using custom hooks to manage fetch states).
- **When would we switch to Redux (or Zustand/Redux Toolkit)?** 
  - If the application grew to require complex client-side data caching across multiple disconnected views, frequent high-velocity state updates (e.g., collaborative real-time editing), or complex time-travel debugging. Context API re-renders all consumers on every change, which can be a performance bottleneck for rapidly changing data, but is perfectly optimal for rarely changing data like user sessions.

## 2. MongoDB Schema Design: Referencing vs. Embedding

**Decision:** We are using a **Hybrid Approach (Referencing for core entities, Embedding for localized data)**.
Specifically: 
- `Users` and `Projects` are separate collections (Referenced).
- `Documents` or `Sources` are referenced within `Projects`.
- Small, bounded lists (like tags or settings) are embedded.

**Tradeoffs & Rationale:**
- **Embedding:** Embedding documents (e.g., putting all project notes directly inside the `Project` document) provides blazing-fast read performance because it requires only a single database query. However, MongoDB has a 16MB document size limit. If a project can have hundreds of extensive research documents, embedding will quickly hit this limit and cause performance degradation during updates.
- **Referencing (Our Choice for Projects/Documents):** By creating a separate `Documents` collection and referencing their ObjectIDs in the `Project` schema, we ensure that projects can scale infinitely. We trade a slight hit in read performance (requiring `$lookup` or `.populate()`) for write performance, scalability, and avoiding unbounded array growth.
- **Indexing:** We will index the `userId` on the `Projects` collection and `projectId` on the `Documents` collection to ensure that queries remain performant (O(log N) instead of O(N) collection scans) as the database grows.

## 3. API Pagination and Rate Limiting

**Decision:** Implement **Cursor-based or Offset-based Pagination** for lists (like projects or search results) and use **Token-Bucket Rate Limiting** at the gateway/middleware level.

**Tradeoffs & Rationale:**
- **Pagination (Offset vs. Cursor):** 
  - We will use standard *Offset/Limit* pagination for the dashboard data tables to allow users to jump to specific pages. While offset pagination becomes slower at massive depths (e.g., `skip(10000)`), it is generally sufficient and easier to implement for standard admin/dashboard views. 
  - *Alternative:* Cursor-based pagination (using the last seen `_id`) is highly performant for infinite scroll feeds but lacks the ability to jump to "Page 5" easily.
- **Rate Limiting:** 
  - Since this is an "AI-Powered" app, backend endpoints that interface with LLMs are computationally expensive and incur API costs. We implement `express-rate-limit` to prevent abuse. The tradeoff is state management for the rate limiter (in-memory is easy but doesn't scale horizontally; Redis is better but adds infrastructure complexity). We will start with memory-based for the MVP.

## 4. React Component Structure: Prop Drilling vs. Context/Composition

**Decision:** We prioritize **Component Composition** and localized state over excessive Context usage or deep Prop Drilling.

**Tradeoffs & Rationale:**
- **Prop Drilling:** Passing props down 1-2 levels is explicit, easily trackable, and preferred. However, passing props down 5+ levels creates tight coupling and makes refactoring difficult.
- **Context API Abuse:** Putting everything into Context to avoid prop drilling causes unnecessary re-renders of the entire component tree.
- **Our Approach (Composition):** We use the `children` prop and component composition to keep state high in the tree but render nested components without drilling props through intermediate layers that don't need them. This maintains the explicit nature of props while avoiding the performance pitfalls of global context and the maintainability nightmare of deep prop drilling.
