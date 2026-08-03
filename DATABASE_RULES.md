# Purpose
This document serves as the official database architecture and implementation specification for the mobile application framework. It defines the mandatory patterns, technologies, and constraints for handling data to ensure that any feature added to this framework remains offline-first, locally persistent, and architecturally consistent.

# Database Philosophy
The framework adheres to three core principles:
1. **Offline-first**: The application must be fully functional without an active internet connection. 
2. **Local-first**: User data is primary stored and managed on the local device.
3. **Mobile-first**: Performance, persistence, and reliability are optimized for mobile environments.

# Official Database Technology
The primary database engine is **Capacitor SQLite**.
*   **Why:** Capacitor SQLite provides a robust, production-grade bridge to native SQLite engines on Android and iOS. It offers high performance for large datasets, complex queries, and reliable local persistence which is essential for the "local-first" experience.

# Database Architecture
To ensure separation of concerns and maintainability, data access must follow this multi-layer architecture:
*   **Database Service**: The low-level layer responsible for initializing the connection, managing connections, and executing raw SQL queries via the native driver.
*   **Migrations**: A dedicated system to manage schema changes. No direct `CREATE TABLE` or `ALTER TABLE` statements should ever occur outside of a migration script.
*   **Repositories**: The intermediary layer that abstracts data access logic from the business logic. It handles specific domain queries (e.g., `getUserById`, `get_unfinished_tasks`).
*   **Models**: TypeScript types and interfaces that represent the shape of the data, ensuring type safety across the application.

# Database Rules
1. **Single Source of Truth**: The local SQLite database is always the source of truth for the UI. 
2. **Abstraction Layer**: No component or business logic function may import raw SQL execution utilities directly. All interactions must go through the Repository layer.
3. **Type Safety**: Every database record must have a corresponding TypeScript Model/Interface.
4. **Schema Evolution**: Any change to the database structure must be executed via a versioned migration script.
5. **Concurrency**: Ensure that the service layer handles connection pooling or queuing as needed by the mobile environment.

# Prohibited Practices
The following practices are strictly prohibited unless specifically overridden for a unique, requested edge case:
*   **Supabase/Firebase as Primary Storage**: Use these only as optional synchronization layers. They must never be the primary source of truth for the local UI state.
*   **Firestore / MongoDB**: These non-relational databases are not supported by this architecture.
*   **Direct SQL in Components**: Writing raw SQL within React components is forbidden.
*   **Schema Changes via Logic**: You may not modify tables based on business logic conditions at runtime; all mutations must be immutable until the next migration.
*   **Sample Data/Users**: The framework must remain "clean." No seed data, dummy users, or test records are to be included in the core library code.
*   **Business Logic in Repository**: Repositories should only handle data fetching and selection, not complex business rules (e.g., calculating taxes, validating email formats).

# Migration Rules
1. Every change to the schema must increment a version number.
2. Migrations must check if a migration has already been applied before attempting execution.
3. Rollbacks must be documented or supported where feasible during development.

# Synchronization Strategy
*   **Primary Hub**: The local SQLite database is the only source of truth for front-end availability.
*   **Cloud Sync**: Components like Firebase, Supabase (via Vapor/Realtime), or custom WebSockets may exist as auxiliary "Sync Engines."
*   **Offline Sync Logic**: If a sync engine exists, it must work by synchronizing local SQLite data with the remote cloud in the background. The UI should never wait on a network request to display data that exists locally.

# Future Expansion
Any new database technologies or secondary storage methods (e.g., IndexedDB for caching) must be evaluated against these rules. They may only be added if they do not compromise the "Offline-first" and "Local-first" integrity of core features.