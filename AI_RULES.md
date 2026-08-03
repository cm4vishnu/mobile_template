# Purpose
This document defines the mandatory behavior and operational constraints for any AI model interacting with this repository. It serves as the primary governing specification to ensure consistency, architectural integrity, and technical alignment across all modifications. This document is the highest priority; if a conflict arises between instructions in AI_RULES.md and any other file, the rules defined herein take precedence.

# AI Workflow
Before generating any code, the AI must follow this mandatory sequence:
1. Read project documentation to understand context.
2. Analyze the user's request thoroughly.
3. Inspect existing files to identify existing patterns and tools.
4. Reuse existing components, hooks, types, and utilities where possible.
5. Modify existing files before creating new ones to avoid bloat.
6. Preserve the established system architecture at all times.
7. Generate complete, working code blocks (no placeholders).
8. Verify that the output aligns with all project rules before finalizing.

# Documentation Reading Order
AI must always read these documents in the following order before performing any task:
1. AI_RULES.md
2. ARCHITECTURE.md
3. TECH_STACK.md
4. DATABASE_RULES.md
5. CODING_STYLE.md
6. FOLDER_STRUCTURE.md

# General Rules
ALWAYS inspect the existing project before generating code.

If similar functionality already exists, extend or modify it instead of creating a new implementation.

- **NEVER** invent architecture or folder structures not already present in the project.
- **NEVER** replace or alter the core system architecture.
- **NEVER** change the technology stack of the application.
- **NEVER** introduce new libraries or dependencies unless explicitly requested by the user.
- **NEVER** implement business logic inside UI components; it must reside in the Service Layer.
- **NEVER** create demo applications, sample users, or placeholder features.
- **NEVER** generate "stub" code or partial implementations.
- **ALWAYS** produce production-quality, typed, and optimized code.

# File Rules
- Modify existing files before creating new ones to minimize project footprint.
- Scan for reusable modules (hooks, components, utils) before generating new ones.
- Prevent the creation of duplicate files or redundant logic.
- Keep all items in their designated directories according to FOLDER_STRUCTURE.md.
- Never move or rename files unless explicitly requested by the user.
File modification priority:

1. Modify an existing file.
2. Extend an existing file.
3. Create a new file only if no suitable file exists.

Creating duplicate functionality is prohibited.

# Architecture Rules
The application must strictly adhere to a layered architecture:
1. **Application Layer**: Manages high-level flow and state coordination.
2. **Service Layer**: Contains all business logic, API calls, and data processing.
3. **Shared Layer**: Contains universal types, constants, themes, and reusable utilities.

**Prohibitions:**
- AI may never bypass layers (e.g., logic in the presentation layer).
- UI components must NEVER directly interact with databases or raw storage engines.

# Technology Rules
Only use the following approved technologies:
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Capacitor
- Capacitor SQLite

**Optional (only if requested):**
- Firebase Authentication
- Gemini
- Ollama

**Explicitly Prohibited unless specifically requested:**
- Supabase, Firestore, MongoDB, PostgreSQL, MySQL
- Redux, Zustand
- Flutter, Ionic UI

# Code Generation Rules
- Produce complete files; do not omit sections.
- No placeholders (e.g., `// TODO: implement logic`).
- No partial implementations; code must be ready for deployment.
- Keep functions small and focused on a single responsibility.
- Prefer composition over complex, multi-purpose components.
- Use custom hooks for reusable logic.
- Use dedicated services for business logic and API interactions.
- Reuse existing project types and utility functions consistently.

# Before Creating New Code
Before generating any new code, the AI must check:
1. `src/components` (Are there similar UI patterns?)
2. `src/hooks` (Is the logic already abstracted into a hook?)
3. `src/services` (Does this require an API or logic service?)
4. `src/types` (Do we have existing interfaces/types for this data?)
5. `src/utils` (Is there a helper function that can do this?)

# Before Finishing
Before finalizing a response, verify the following:
- Architecture remains intact and no layers were bypassed.
- Folder placement is correct according to documentation.
- TypeScript types are strictly enforced (no `any`).
- No logic is duplicated across different files/components.
- All dependencies are within the approved tech stack.
- There are no unused imports or dead code blocks.
- Imports are resolved correctly relative to current file locations.
- No "placeholder" text remains in any part of the output.

# Guiding Principles
- **Consistency over preference**: Follow established patterns even if a different way seems easier.
- **Reuse over recreation**: If it exists, use it. Don't build it twice.
- **Architecture over convenience**: Never shortcut the layers for "quick" fixes.
- **Simplicity over cleverness**: Write readable, standard code rather than "clever" hacks.
- **Maintainability over speed**: Build for long-term ownership and scaling.
- **Offline-first**: Ensure logic supports offline capabilities where applicable in mobile context.
- **Mobile-first**: All UI elements must be optimized for touch and mobile viewports.
- **Long-term scalability**: Code should accommodate feature growth without structural overhauls.

# Implemenatation Priority

When implementing a feature, AI should prioritize:

1. Correctness
2. Architecture
3. Reuse
4. Maintainability
5. Performance
6. Readability

Never sacrifice architecture for convenience.