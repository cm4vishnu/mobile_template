# Folder Structure Reference

This document serves as the definitive architecture map for the React + Capacitor mobile framework. It is designed to guide autonomous agents in placing files with 100% accuracy based on architectural intent.

## Project Root

### src/
- **Purpose**: The core source directory containing all application logic, assets, and configurations.
- **Responsibilities**: Housing the entire frontend codebase for the React application.
- **What belongs here**: All `.tsx`, `.ts`, `.css`, and configuration files used by the build system.
- **What must never be placed here**: Build artifacts, raw images (unless processed), or third-party library source code.
- **Typical files**: `main.tsx`, `App.tsx`, `vite.config.ts`.
- **Dependencies**: React, Vite, Tailwind CSS.

### public/
- **Purpose**: Static assets served directly by the web server without being processed by the bundler.
- **Responsibilities**: Hosting icons, favicons, and manifest files used in Capacitor's shell.
- **What belongs here**: `favicon.ico`, `manifest.json`, `robots.txt`.
- **What must never be placed here**: Source code or any assets that need bundling/processing.

### assets/
- **Purpose**: Raw media assets (images, SVGs, fonts) managed via the build pipeline.
- **Responsibilities**: Providing visual content used within components.
- **What belongs here**: `.png`, `.jpg`, `.svg`, `.woff2`.
- **What must never be placed here**: Executable scripts or configuration files.

### docs/
- **Purpose**: Internal documentation and architectural specifications.
- **Responsibilities**: Housing the technical roadmap, design rules, and internal manuals.
- **What belongs here**: `ARCHITECTURE.md`, `AI_RULES.md`, `TECH_STACK.md`.
- **What must never be placed here**: Application code or production assets.

## Application Layer

### src/app/
- **Purpose**: High-level application orchestration and routing.
- **Responsibilities**: Managing core layout, routing logic, and initialization flows.
- **What belongs here**: Root layouts, navigation providers, global wrappers.
- **What must never be placed here**: Low-level logic or specific feature implementations.

### src/features/
- **Purpose**: Domain-specific modules containing unique business logic and UI slices.
- **Responsibilities**: Organizing the app into "features" (e.g., `auth`, `dashboard`, `profile`).
- **What belongs here**: Logic tied to a single functional area; local components for that feature only.
- **What must never be placed here**: Shared global constants or generic UI components.

### src/components/
- **Purpose**: Reusable UI building blocks (Atomic Design).
- **Responsibilities**: Rendering standard elements like Buttons, Modals, Cards, and Inputs.
- **What belongs here**: Pure presentational components (shadcn/ui customizations) and molecules.
- **What must never be placed here**: Business logic or direct API calls; these should be handled in services.

## Service Layer

### src/services/
- **Purpose**: Core infrastructure abstractions.
- **Responsibilities**: Common utility patterns for the application'-wide data handling.
- **What belongs here**: Generic wrappers around external APIs.

### src/services/ai/
- **Purpose**: AI logic and integration layer.
- **Responsibilities**: Managing prompt flows, LLM connections (Gemini), and token management.
- **What belongs here**: `gemini_service.ts`, `prompt_manager.ts`.

### src/services/auth/
- **Purpose**: Authentication & Authorization.
- **Responsibilities**: Session management, JWT handling, login/signup flows via providers.
- **What belongs here**: auth_provider.tsx, useAuth.ts logic.

### src/services/database/
- **Purpose**: Persistence layer for SQLite.
- **Responsibilities**: CRUD operations, migrations, and raw SQL abstractions.
- **What belongs here**: Database connection initiators, migration files.

### src/services/storage/
- **Purpose**: Local device storage management.
- **Responsibilities**: Key-value storage utilizing Capacitor Preferences or local cache.
- **What belongs here**: Cache managers, persistent setting getters.

## Shared Layer

### src/hooks/
- **Purpose**: Reusable React Hook logic.
- **Responsibilities**: Encapsulating component state and side effects that are used in multiple places.
- **What belongs here**: `useDebounce`, `useAuthStatus`, `useWindowSize`.

### src/utils/
- **Purpose**: Pure utility functions.
- **Responsibilities**: Formatting dates, transforming types, or math calculations with no React hooks inside.
- **What belongs here**: `date_formatter.ts`, `validation_helpers.ts`.

### src/types/
- **Purpose**: TypeScript type and interface definitions.
- **Responsibilities**: Creating the global "contract" for data structures and component props.
- **What belongs here**: `.d.ts` files or `index.ts` containing shared interfaces.

### src/styles/
- **Purpose**: Global styling configurations.
- **Responsibilities**: Tailwind plugin configs, CSS variables (shadcn), and global CSS rules.
- **What belongs here**: `globals.css`, `tailwind.config.ts`.

## Folder Dependency Rules
1. **Application Layer** may call **Service Layer** or **Shared Layer**.
2. **Share Layer** must never depend on any other folder (it is the foundation).
3. **Feature Layers** can only import from their own folder, the **Component** layer, or the **Shared** layer. They should not reach across to other features directly.
4. **Service Layer** may only call types and utils from the **Shared Layer**.

## File Placement Rules
1. New UI components that are used only in one component must be placed in `src/features/[feature-name]/components`.
2. Generic, reusable buttons or inputs must go to `src/components`.
3. Any logic interacting with external hardware (SQLite, Camera, Filesystem) must reside in `src/services/`.
4. Shared types should always have a corresponding file in `src/types/` before being implemented elsewhere.

## AI Placement Rules
1. **Modify Before Create**: If a file exists that fulfills 80% of the requirement, modify it instead of creating a new one.
2. **Reference Core Files**: Always refer to `AI_RULES.md`, `ARCHITECTURE.md`, `TECH_STACK.md`, `DATABASE_RULES.md`, and `CODING_STYLE.md` before generating any logic.
3. **No New Roots**: Never create a new top-level folder in `src/`. If a feature is missing, find where it fits into the existing structure.
4. **Strict Component Boundaries**: UI components must not contain raw data fetching logic; they must use hooks or passed props to interact with services.