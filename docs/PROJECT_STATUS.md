# Project Status and Roadmap

This document provides a comprehensive overview of the current state of the **bg.me** backgammon web app and outlines the remaining tasks required to reach a release-ready version.

## Current Tech Stack

- **Framework**: Next.js (`app/` directory, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom design tokens (`globals.css`)
- **State Management**: Zustand for client-side store (`src/store/game.ts`)
- **Realtime**: WebSockets via custom API route (`src/app/api/socket`) and hooks (`useGameSocket`)
- **Authentication**: NextAuth with Prisma adapter (`src/lib/auth.ts`)
- **Database**: PostgreSQL via Prisma (`prisma/schema.prisma`) and Kysely for edge usage
- **Storage & Caching**: Vercel KV and Blob, Edge Config helpers (`src/lib/vercel.ts`)
- **Notifications**: Novu integration and custom notifications API
- **UI Components**: Shadcn/Radix based component library under `src/components/ui`
- **PWA**: Configured via `next-pwa` plugin with service worker

## High Level Architecture

```
[Client (Next.js React app)]
   |
   |--Authentication (NextAuth)
   |--Game UI (GameBoard, ChatBox, etc.)
   |--State via Zustand --> useGameSocket --> WebSocket API
   |
[Next.js API Routes]
   |-- /api/auth/*  (login/signup)
   |-- /api/rooms    (create & list rooms)
   |-- /api/rooms/[roomId] (join, messages, ready state)
   |-- /api/socket   (WebSocket server for realtime updates)
   |-- /api/notifications, /api/friends
   |
[Backend Services]
   |-- PostgreSQL (Prisma models: User, Room, Player, Message, etc.)
   |-- Vercel KV (room cache, player sessions)
   |-- Vercel Blob (video & game state snapshots)
   |-- Novu (email notifications)
```

## Key Pages & Components

- `src/app/page.tsx` – Landing page with hero video and CTA buttons.
- `src/app/auth/*` – Sign in/up forms using NextAuth.
- `src/app/room/page.tsx` – Lobby showing friends and active rooms.
- `src/app/room/[id]/page.tsx` – Main game room hosting `GameRoom` component.
- `src/components/game` – Contains core gameplay UI: `Board`, `Match`, `Chat`, `RoomInfo`, etc.
- `src/app/instructions/page.tsx` – Collapsible tutorial on rules and usage.
- `src/app/blog/*` – Static blog posts.

## Gameplay Engine Overview

Game logic utilities reside in `src/lib/gameLogic.ts` and shared types in `src/lib/shared/schema.ts`. Current features:

- Initial board setup (`INITIAL_BOARD`).
- Dice rolling, move validation, and applying moves.
- Helpers for checking game over and determining winner.
- Not yet implemented: doubling cube, full bearing off rules, match play logic.

The `GameBoard` and `Board` components render a simplified board using Tailwind CSS. Moves are dispatched through `useGame` store which communicates over WebSocket to update the server and other clients.

## Known Gaps Before Release

1. **Comprehensive Game Rules**
   - Current engine supports basic piece movement but lacks advanced rules (hitting, bar, bearing off, doubling cube, match scoring).
   - Need rigorous unit tests for all game scenarios.

2. **Robust Realtime Sync**
   - WebSocket server in `src/lib/socket.ts` handles moves and messages but error handling and reconnection logic are minimal.
   - Consider migrating to `socket.io` or refining the custom protocol.

3. **User Profiles & Friends**
   - Friend requests & notifications APIs exist but profile pages are missing.
   - Need UI for viewing friends, pending requests, and notifications.

4. **Spectator Mode**
   - Room model supports spectators yet the UI only partially handles them.
   - Implement spectator join flow and read‑only board view.

5. **Matchmaking & Lobby**
   - Current lobby shows active rooms for logged‑in user but no public matchmaking or quick-play option.

6. **Responsive & Mobile Design**
   - Base components are responsive but game board UX on small screens requires polishing.

7. **PWA & Offline Support**
   - Service worker generated via `next-pwa` but caching strategies need verification.

8. **Testing & CI**
   - No automated tests or lint step in CI yet. Add unit tests for game logic and integration tests for API routes.

9. **Deployment Configuration**
   - Ensure environment variables for Prisma, Vercel KV, Novu, etc., are set in production.
   - Create database migration scripts and seed data for production.

## Suggested Roadmap to Release

1. **Finalize Core Gameplay**
   - [x] Complete rule implementation (hitting, bar, bearing off).
   - [ ] Add doubling cube and match scoring if desired.
   - [ ] Polish GameBoard visuals and interactions.

2. **Improve Realtime Infrastructure**
   - Harden WebSocket server with reconnect/backoff logic on client.
   - Implement server-side validation of moves.

3. **User Experience Enhancements**
   - **Profile page with friend management and notifications UI implemented.**
   - Implement spectator view and optionally chat moderation.
   - Ensure accessibility: keyboard controls, screen reader labels.

4. **Mobile & PWA Polishing**
   - Optimize layouts for mobile; test across devices.
   - Confirm PWA installability and offline behavior.

5. **Testing & QA**
   - Add Jest/Vitest suite for game logic and API endpoints.
   - Set up GitHub Actions for CI.

6. **Launch Prep**
   - Set up production database and migrations.
   - Configure domain, SSL, and environment variables on hosting (e.g., Vercel).
   - Write launch announcement/blog post.

## Wireframe Sketches

Below are simple text-based representations of primary screens.

### Lobby (`/room`)
```
+-----------------------------------------------------+
| Friends  [Add Friend]                               |
| - Avatar Name [Invite]                              |
| - ...                                               |
+-----------------------------------------------------+
| Active Rooms            [New Room]                  |
| [🧑 A] vs [🧑 B]   (playing) -> Join                |
| [🧑 C] vs [🧑 D]   (waiting) -> Join                |
+-----------------------------------------------------+
```

### Game Room (`/room/[id]`)
```
+---------------------------+-------------------------+
|         Board             |        Chat             |
| [triangular points...]    | [messages scroll]       |
| [dice + roll button]      | [input box]             |
+---------------------------+-------------------------+
```

### Sign In / Sign Up
```
+---------------------------+
|  Email [__________]       |
|  Password [__________]    |
| [ Sign In ]               |
| [ Sign Up ]               |
+---------------------------+
```

## Conclusion

The project already includes a solid foundation with authentication, room management, real‑time play, and a modern UI. Finishing the gameplay engine, enhancing social features, and thorough testing are the main barriers to a public release.

