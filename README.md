# React Capacitor Framework

A production-ready, reusable React + Capacitor mobile application framework. This repository serves as the official template for building offline-first, mobile-first applications with a clean three-layer architecture.

---

## Project Overview

This framework provides a complete foundation for building cross-platform mobile applications using web technologies. It is **not an application** — it is the architectural template that every future application will be built upon.

**Goals:**
- Enforce architectural consistency across all projects
- Provide reusable infrastructure (database, auth, AI, storage)
- Enable offline-first development by default
- Maintain a minimal, typed, and maintainable codebase
- Support both iOS and Android via Capacitor

---

## Technology Stack

| Technology | Purpose | Status |
|------------|---------|--------|
| React | UI Library | Required |
| Vite | Build Tool & Dev Server | Required |
| TypeScript | Type Safety | Required |
| Tailwind CSS | Styling Framework | Required |
| shadcn/ui | Component Library | Required |
| Capacitor | Native Mobile Bridge | Required |
| Capacitor SQLite | Local Database | Required |
| React Context & Hooks | State Management | Required |
| Firebase Authentication | Remote Auth | Optional |
| Gemini API | Cloud AI | Optional |
| Ollama | Local AI Inference | Optional |
| Lucide React | Icons | Required |

**Prohibited:** Supabase, Firestore, MongoDB, PostgreSQL, MySQL, Redux, Zustand, Ionic UI, Flutter.

---

## Architecture

The framework follows a strict **three-layer architecture**:

```
Application Layer  →  User interface, routing, feature composition
Service Layer      →  Infrastructure, persistence, AI, auth, external integrations
Shared Layer       →  Reusable utilities, hooks, types, styling
```

**Key Principles:**
- Business logic never lives in UI components
- UI components never access databases or APIs directly
- Services depend only on the Shared Layer
- Features are isolated and never depend on each other

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete specification.

---

## Project Structure

```
src/
├── app/                 # Application bootstrap, routing, providers
├── components/          # Reusable UI components (shadcn/ui)
├── features/            # Domain-specific feature modules (empty by default)
├── hooks/               # Shared React hooks
├── lib/                 # Shared library utilities
├── services/
│   ├── ai/              # AI infrastructure (Gemini, Ollama)
│   ├── auth/            # Authentication infrastructure (Firebase)
│   ├── database/        # SQLite infrastructure, migrations, repositories
│   └── storage/         # Device storage (Preferences)
├── styles/              # Global styling, theme variables
├── types/               # Shared TypeScript definitions
└── utils/               # Pure utility functions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-capacitor-framework

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Capacitor Commands

```bash
# Add platforms (after first build)
pnpm cap add ios
pnpm cap add android

# Open native IDEs
pnpm cap open ios
pnpm cap open android

# Sync web assets to native projects
pnpm cap sync
```

---

## Creating a New Application

1. **Clone this repository** — Use it as your starting template
2. **Rename the project** — Update `package.json` name and `capacitor.config.ts` appId/appName
3. **Configure environment** — Copy `.env.example` to `.env` and add keys
4. **Implement features** — Add domain logic inside `src/features/`
5. **Extend services** — Add repositories, models, and migrations as needed

---

## Development Guidelines

All contributors (human and AI) must follow the governing documents in this order:

1. [AI_RULES.md](AI_RULES.md) — Mandatory AI behavior and constraints
2. [ARCHITECTURE.md](ARCHITECTURE.md) — Structural rules and layer boundaries
3. [TECH_STACK.md](TECH_STACK.md) — Approved and prohibited technologies
4. [DATABASE_RULES.md](DATABASE_RULES.md) — Offline-first data persistence rules
5. [CODING_STYLE.md](CODING_STYLE.md) — TypeScript, React, and formatting standards
6. [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) — File placement and dependency rules
7. [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md) — Standardized implementation workflow

**Before writing code:** Read the documentation, inspect existing files, reuse before creating.

---

## Included Infrastructure

The framework ships with production-ready infrastructure modules:

| Module | Location | Description |
|--------|----------|-------------|
| Capacitor Core | `capacitor.config.ts` | Native bridge configuration |
| SQLite Database | `src/services/database/` | Connection, migrations, base repository |
| Preferences Storage | `src/services/storage/` | Key-value device storage |
| Firebase Auth | `src/services/auth/` | Authentication provider abstraction |
| Gemini AI | `src/services/ai/gemini.ts` | Cloud LLM integration |
| Ollama AI | `src/services/ai/ollama.ts` | Local LLM integration |
| Shared Components | `src/components/ui/` | shadcn/ui component library |
| Shared Hooks | `src/hooks/` | Reusable React logic |
| Shared Utilities | `src/utils/`, `src/lib/` | Formatting, validation, helpers |
| Shared Types | `src/types/` | Global TypeScript contracts |

---

## Philosophy

- **Offline-first** — Local SQLite is the source of truth; network is a sync layer
- **Mobile-first** — Touch-optimized, responsive, performant on device
- **Strong typing** — Strict TypeScript, no `any`, explicit contracts
- **Reusable architecture** — Three-layer separation, provider abstraction
- **Separation of concerns** — UI, logic, and infrastructure never mix
- **Minimal dependencies** — Every package justified by framework requirements
- **Long-term maintainability** — Code written for the next developer, not the next sprint

---

## Future Roadmap

Planned framework enhancements:

- **Android & iOS** — Native project templates and build pipelines
- **Synchronization Engine** — Background sync between local SQLite and remote backends
- **Additional Capacitor Plugins** — Camera, Filesystem, Geolocation, Push Notifications
- **More Reusable Services** — Analytics, Crash Reporting, Feature Flags
- **Testing Infrastructure** — Unit, integration, and E2E test configurations
- **CI/CD Templates** — GitHub Actions workflows for mobile builds

---

## License

MIT License — Free for personal and commercial use.