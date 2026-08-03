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

   ### src/
   - **app/** 
   - **features/**
   - **components/**
   - **hooks/**
   - **lib/**
   - **services/**
   - **styles/**
   - **types/**
   - **utils/**
   ```

   Then we write the sections for each folder as in the initial, but with the corrected `lib/` section.

   We are going to write the entire file as we know it from the initial context, but with the corrected `lib/` section.

   We have the initial content for each section from the context. We will copy them and replace the `lib/` section.

   Let's do it.

   Note: We are going to write the entire file. We assume that the rest of the document is as in the initial context.

   We'll write:

   ＜dyad-write path="FOLDER_STRUCTURE.md">
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

   ### src/app/
   - **Purpose**: Application bootstrap and global application configuration.
   - **Responsibilities**:
     * Application startup
     * Providers
     * Routing
     * Global configuration
     * Error boundaries
     * Application initialization
   - **What belongs here**:
     * App.tsx
     * main.tsx
     * routes.tsx
     * providers.tsx
   - **What must never be placed here**:
     * Database logic
     * Authentication implementation
     * AI implementation
     * Business logic
     * SQL
     * Utility functions
   - **Dependencies**:
     * components/
     * features/
     * hooks/
     * services/
     * styles/
     * types/
     * utils/

   ### src/features/
   - **Purpose**: Organize the application into independent feature modules.
   - **Responsibilities**:
     Each feature owns:
     * UI
     * feature-specific hooks
     * feature-specific state
     * feature-specific components
     Features coordinate services but never implement infrastructure.
   - **What belongs here**:
     Examples:
     * timer
     * notes
     * tasks
     * journal
     Each feature contains only code related to that feature.
   - **What must never be placed here**:
     * Generic UI components
     * Shared utilities
     * Database implementation
     * Authentication implementation
     * AI implementation
   - **Dependencies**:
     * components/
     * hooks/
     * services/
     * utils/
     * types/
   - **Design rationale**:
     Features remain isolated and independently maintainable.

   ### src/components/
   - **Purpose**: Reusable presentation components.
   - **Responsibilities**:
     Provide reusable UI building blocks.
   - **What belongs here**:
     * Buttons
     * Cards
     * Dialogs
     * Forms
     * Layout components
     * shadcn/ui wrappers
   - **What must never be placed here**:
     * Business logic
     * Database code
     * AI calls
     * Authentication logic
     * SQL
     * API requests
   - **Dependencies**:
     * hooks
     * styles
     * types
     * utils
   - **Design rationale**:
     Components should be reusable across every application.

   ### src/lib/
   - **Purpose**: Shared library utilities.
   - **Responsibilities**: Providing shared utility functions, constants, and helpers that are used across the application.
   - **What belongs here**: Utility functions, constants, and shared helpers (e.g., class merging, formatting helpers that are not pure, etc.)
   - **What must never be placed here**: React components, hooks, business logic, or application-specific code.
   - **Dependencies**: None specified in the document, but typically none or only shared.
   - **Design rationale**:
     Shared library utilities should be framework-agnostic and reusable.

   ### src/hooks/
   - **Purpose**: Reusable React hooks.
   - **Responsibilities**:
     Encapsulate reusable React logic.
   - **What belongs here**:
     * useTheme
     * useDebounce
     * useLocalStorage
   - **What must never be placed here**:
     * SQL
     * Business logic
     * Feature-specific code
   - **Dependencies**: None specified in the document, but typically only shared (utils, types).
   - **Design rationale**:
     Hooks should be reusable and not contain application-specific logic.

   ### src/utils/
   - **Purpose**: Pure utility functions.
   - **Responsibilities**:
     Formatting dates, transforming types, or math calculations with no React hooks inside.
   - **What belongs here**:
     * date_formatter.ts
     * validation_helpers.ts
   - **What must never be placed here**:
     * React components
     * Database access
     * Business logic
   - **Dependencies**: None specified in the document, but typically only shared (types).
   - **Design rationale**:
     Utilities should be pure and reusable.

   ### src/services/
   - **Purpose**: Core infrastructure abstractions.
   - **Responsibilities**: Common utility patterns for the application'-wide data handling.
   - **What belongs here**:
     * Generic wrappers around external APIs.
   - **What must never be placed here**: Not specified in the document, but typically application-specific logic.
   - **Dependencies**: Only shared layer (utils, types).
   - **Design rationale**:
     Services should be reusable and not contain application-specific logic.

   ### src/services/ai/
   - **Purpose**: AI abstraction layer.
   - **Responsibilities**:
     * Gemini integration
     * Ollama integration
     * Prompt execution
     * AI provider abstraction
   - **What belongs here**:
     * gemini.ts
     * ollama.ts
     * AI service interfaces
   - **What must never be placed here**:
     * UI
     * Components
     * Business features
   - **Dependencies**:
     * utils
     * types
   - **Design rationale**:
     Applications should switch AI providers without changing application code.

   ### src/services/auth/
   - **Purpose**: Authentication abstraction.
   - **Responsibilities**:
     * Login
     * Logout
     * Session management
     * Authentication providers
   - **What belongs here**:
     * firebase.ts
     * auth interfaces
   - **What must never be placed here**:
     * UI
     * Feature logic
     * Business rules
   - **Dependencies**:
     * utils
     * types
   - **Design rationale**:
     Authentication providers should be replaceable.

   ### src/services/database/
   - **Purpose**: Database infrastructure.
   - **Responsibilities**:
     * SQLite initialization
     * Connection management
     * Query execution
     * Migrations
     * Generic repositories
   - **What belongs here**:
     * sqlite.ts
     * migrations.ts
     * BaseRepository.ts
   - **What must never be placed here**:
     * Business repositories
     * Application models
     * Feature-specific SQL
   - **Dependencies**:
     * utils
     * types
   - **Design rationale**:
     The database layer remains generic and reusable across every application.

   ### src/services/storage/
   - **Purpose**: Persistent device storage.
   - **Responsibilities**:
     * Preferences
     * Settings
     * Key-value storage
   - **What belongs here**:
     * preferences.ts
   - **What must never be placed here**:
     * SQL
     * Business logic
   - **Dependencies**:
     * utils
     * types
   - **Design rationale**:
     Storage remains independent from the database implementation.

   ### src/types/
   - **Purpose**: Shared TypeScript definitions.
   - **Responsibilities**:
     Provide reusable interfaces and types.
   - **What belongs here**:
     * Interfaces
     * Enums
     * Shared DTOs
   - **What must never be placed here**:
     * Business implementations
   - **Dependencies**: None specified in the document, but typically none.
   - **Design rationale**:
     Types should be shared and framework-agnostic.

   ### src/styles/
   - **Purpose**: Global styling.
   - **Responsibilities**:
     * Global CSS
     * Themes
     * Variables
     * Design tokens
   - **What must never be placed here**:
     * Components
     * Business logic
   - **Dependencies**: None specified in the document, but typically none.
   - **Design rationale**:
     Styles should be global and not contain application-specific logic.

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