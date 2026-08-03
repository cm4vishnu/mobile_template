# Purpose
This document serves as the single source of truth for the technical architecture and technology stack permitted within this project framework. It is designed to guide both human developers and AI agents in making consistent architectural decisions, ensuring that all projects built using this template remain lightweight, high-performing, and maintainable.

# Official Technology Stack

### Frontend & Core
*   **React**: The primary UI library for building component-based user interfaces. Used for its ecosystem stability and declarative nature.
*   **Vite**: The build tool and development server. Selected for its extremely fast Hot Module Replacement (HMR) and optimized bundling.
*   **TypeScript**: Mandatory for all logic. Used to provide static type safety, improve developer experience, and catch errors during compilation rather than at runtime.
*   **Tailwind CSS**: The primary styling engine. Used for rapid UI development through utility-first classes.
*   **shadcn/ui**: The base component library (Radix UI + Tailwind). Used to provide accessible, high-quality building blocks that are customizable at the source level.

### Mobile & Core Infrastructure
*   **Capacitor**: The bridge between web technologies and native mobile hardware. It is used to package the React application for iOS and Android.
*   **Capacitor SQLite**: The primary database engine. Using it ensures high-performance, local data persistence on mobile devices.
*   **Offline-first Architecture**: A fundamental design principle. The application must be functional without an active internet connection; network calls should be treated as "sync" actions rather than requirements for UI rendering.

### Optional Features (Conditional)
*   **Firebase Authentication**: To be used exclusively if remote identity management and social logins are required at the client level.
*   **Gemini API / Ollama Local Models**: The preferred pathways for integrating Large Language Model capabilities into the application. Use Gemini for cloud processing or Ollama for local, private inference.

### State Management
*   **React Context & Hooks**: These are the primary tools for state management. They provide a lightweight way to share state without introducing heavy external dependencies.

### Tools & Environment
*   **pnpm**: The recommended package manager due to its speed and efficient disk space usage through content-addressable storage.
*   **Git**: Standard version control system.

# Approved Technologies

| Technology | Purpose | Required / Optional |
| :--- | :--- | :--- |
| React | UI Library | Required |
| Vite | Build Tool & Dev Server | Required |
| TypeScript | Type Safety / Language | Required |
| Tailwind CSS | Styling Framework | Required |
| shadcn/ui | Component Library | Required |
| Capacitor | Native Mobile Bridge | Required |
| Capacitor SQLite | Local Database | Required |
| React Context/Hooks | State Management | Required |
| Firebase Auth | Authentication | Optional |
| Gemini / Ollama | AI Integration | Optional |
| Lucide-React | Icons | Required |

# Prohibited Technologies

The following technologies are strictly prohibited to keep the codebase clean and minimize overhead. Do not introduce these unless specifically requested via architecture override.

*   **Supabase**: Excluded to maintain a strict separation from third-party BaaS providers where local storage suffices.
*   **MongoDB / PostgreSQL / MySQL / MongoDB Atlas**: Excluded in favor of Capacitor SQLite for mobile performance and offline-first requirements.
*   **Firestore**: Excluded as an alternative to the SQLite/Offline-first strategy.
*   **Ionic UI**: Excluded because Tailwind + shadcn/ui provide more modern customization and lighter payloads.
*   **Flutter**: This is a React-based framework; cross-platform logic must be handled by Capacitor.
*   **Redux / Zustand**: These are considered excessive for the current scope; React Context and Hooks should handle state management unless complex, high-frequency state updates are specifically required.

# Technology Selection Principles

When evaluating new tools or features, use the following guidelines:
1.  **Prefer Offline-first**: If a feature requires data persistence, it must work offline by default.
2.  **Prefer Minimal Dependencies**: Avoid "heavy" libraries for simple tasks (e.g., use date-fns instead of Moment.js).
3.  **Prefer Mature Libraries**: Stick to well-maintained projects with active communities.
4.  **Prefer Long-term Maintainability**: Choose solutions that are easy for other developers to understand and maintain.
5.  **Preference for Cross-platform Compatibility**: Ensure mobile UI remains consistent across iOS and Android via Tailwind styles.
6.  **Avoid Vendor Lock-in**: Favor open standards where possible.
7.  **Keep the Framework Lightweight**: Every added package should provide significant value relative to its bundle size impact.

# Future Expansion
New technologies may only be added if they meet at least four of the following criteria:
1. Provides a feature that cannot be achieved with existing approved tools without significant manual overhead.
2. Significantly improves performance or reduces bundle size.
3. Enhances accessibility or developer experience (DX).
4. Replaces an existing tool with one that is more performant or better maintained.

Any new additions must be reviewed against the **Technical Selection Principles** and, if approved, should have their "Required" or "Optional" status updated in `TECH_STACK.md`.