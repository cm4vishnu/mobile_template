# Purpose
This document defines the official coding standards for this React + Capacitor mobile application framework. It ensures consistency, maintainability, and high-quality code generation by both human developers and AI assistants.

# General Principles
*   **Readability over Cleverness:** Write code that is easy to understand at a glance. Avoid complex "one-liners" or advanced language features unless they provide significant clarity or performance benefits.
*   **Simplicity over Complexity:** Prefer the simplest solution that solves the problem effectively. Do not over-engineer for future scenarios that may not occur.
*   **Consistency over Preference:** Follow established patterns in this codebase. Don't introduce new stylistic choices just because of personal preference.
*   **Composition over Duplication:** Use small, reusable components and hooks. If logic is used in multiple places, abstract it.
*   **Long-term Maintainability:** Write code with the next developer (or AI) in mind. Clear structure and naming are paramount.

# TypeScript Standards
*   **Strict Typing:** Enable strict mode. Every variable, prop, and state must have a clear type definition.
*   **Avoid `any`:** The use of `any` is strictly prohibited unless it is technically impossible to determine the type during development. Use `unknown` if the type is truly dynamic.
*   **Prefer Interfaces:** Use `interface` for public-facing contracts and component props. Use `type` for unions, intersections, or complex transformations.
*   **Explicit Return Types:** Exported functions and components must have explicit return types to ensure contract enforcement.
*   **Immutability:** Prefer `readonly` arrays/objects and immutable state updates (e.g., using spread operators).

# React Standards
*   **Functional Components:** Use functional components exclusively; no class-based components are allowed.
*   **React Hooks:** Utilize standard hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for all logic and side effects.
*   **Single Responsibility Component (SRC):** Keep UI components small and focused on a single task or visual unit.
*   **Logic Decoupling:** Separate business logic and data fetching from the view layer. Logic should reside in custom hooks (`use...`).
*   **Composition over Inheritance:** Build complex layouts by composing smaller, granular components rather than creating deeply nested, multi-purpose components.

# File Naming
*   **Components:** PascalCase (e.g., `PrimaryButton.tsx`, `UserAvatar.tsx`).
*   **Hooks:** camelCase prefixed with "use" (e.g., `useAuth.ts`, `useDebounce.ts`).
*   **Utilities:** camelCase (e.g., `dateFormatter.ts`, `mathUtils.ts`).
*   **Services:** camelCase (e.g., `apiService.ts`, `storageService.ts`).
*   **Types/Interfaces:** PascalCase (e.g., `User.ts`, `AuthResponse.ts`).

# Imports
*   **Grouping Order:**
    1.  React & Core libraries (React, Lucide, etc.)
    2.  Internal Components (@/components)
    3.  Hooks (@/hooks)
    4.  Utilities and Services (@/lib, @/services)
    5.  Types/Constants (@/types, @/constants)
*   **Absolute Paths:** Use absolute paths (e.g., `@/components/...`) instead of relative paths (`../../components`).

# Error Handling
*   **Try-Catch Blocks:** Wrap asynchronous operations and risky logic in `try...catch` blocks.
*   **Error Boundaries:** Use React Error Boundaries for high-level UI catch-alls.
*   **Consistent Status Codes:** Use consistent error codes/types across the application to allow the UI to display appropriate feedback.

# Comments
*   **Why, Not What:** Do not comment what a line of code does (the code should be self-explanatory). Comment *why* a specific logic or workaround was implemented.
*   **Public API Documentation:** Document exported functions and complex hooks with JSDoc to describe parameters, return values, and intent.
*   **Avoid Redundancy:** Remove commented-out code blocks; use version control for that purpose.

# Prohibited Practices
*   **No `any`:** Unless strictly unavoidable in edge cases of external integration.
*   **No Duplication:** DRY (Don't Repeat Yourself). If logic is duplicated, it must be abstracted into a utility or hook.
*   **No Direct Database Logic in UI:** Database queries and raw SQL are never allowed inside components or hooks; they must stay in the service layer.
*   **No Hard-Coded Secrets:** Never hardcode API keys, secrets, or sensitive passwords (use `.env` files).
*   **No Bloated Components:** A component exceeding 150 lines usually indicates it should be split into smaller sub-components.
*   **No Logic in UI:** Complex state management and logic belong in hooks, not directly inside the component body.

# AI Code Generation Rules
*   **Reuse Existing Code:** Always check existing components/hooks before creating new ones to maintain consistency.
*   **Preserve Architecture:** Do not modify folder structures or architectural patterns defined in `ARCHITECTURE.md`.
*   **Check References Before Creating:** Modify existing files first. If a feature is 80% present, complete the existing one rather than building a new one.
*   **Follow Documentation Hierarchy:** When generating code, AI must strictly adhere to:
    1.  `AI_RULES.md` (General behavior)
    2.  `ARCHITECTURE.md` (Structural layout)
    3.  `TECH_STACK.md` (Technology choices)
    4.  `DATABASE_RULES.md` (Data persistence logic)