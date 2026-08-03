# Application Layer

## app/
Purpose: Contains the entry point of the application and defines the main routes.
Responsibilities: Bootstrap the application, configure routing.
What belongs in this folder:
  - index.tsx (main entry point)
  - routes (page-specific code)
Example file names: 
  - Index.tsx
  - Profile.tsx
  - Settings.tsx
Dependencies with other folders:
  - Uses services and components from both the Service Layer and Shared Layer.

## features/
Purpose: Groups related functionalities.
Responsibilities: Define specific features. Contains smaller, modular codebase within it.
What belongs in this folder:
  - TaskManager/
    - tasks.module.tsx
    - TaskList.tsx
    - TaskForm.tsx
Example file names:
  - ChatModule/
    - chat.service.ts
    - ChatterWindow.tsx
  - FileStorageModule/
    - fileUpload.component.tsx
Dependencies with other folders:
  - Uses services and components from both the Service Layer and Shared Layer.

## components/
Purpose: Reusable UI components.
Responsibilities: Provide basic building blocks for the application.
What belongs in this folder:
  - Button.tsx
  - Input.tsx
  - Modal.tsx
Example file names:
  - Avatar.tsx
  - Card.tsx
  - LoadingSpinner.tsx
Dependencies with other folders (none):

# Service Layer

## services/ai/
Purpose: Houses AI-related functionalities.
Responsibilities: Connects to AI APIs, processes requests.
What belongs in this folder:
  - LanguageService.ts
  - ImageRecognition.ts
Example file names:
  - NaturalLanguageAnalysis.ts
  - AIModelManager.ts
Dependencies with other folders (none):

## services/auth/
Purpose: Handles authentication.
Responsibilities: Manages user sessions, integrates with OAuth providers.
What belongs in this folder:
  - AuthService.ts
  - AuthProvider.tsx
Example file names:
  - FirebaseAuthService.ts
  - SupabaseAuthService.ts
Dependencies with other folders (none):

## services/database/
Purpose: Interacts with the database.
Responsibilities: CRUD operations, data validation.
What belongs in this folder:
  - DbService.ts
  - schema.ts
Example file names:
  - SqliteDbService.ts
  - FirestoreDbService.ts
Dependencies with other folders (none):

## services/storage/
Purpose: Handles file and media storage.
Responsibilities: Uploads, retrieves, manages media files.
What belongs in this folder:
  - StorageService.ts
Example file names:
  - AwsS3StorageService.ts
  - CapacitorSQLiteStorageService.ts
Dependencies with other folders (none):

# Shared Layer

## hooks/
Purpose: Custom React Hooks.
Responsibilities: Reusable logic for components, side effects.
What belongs in this folder:
  - useDebounce.ts
  - useLocalStorage.tsx
Example file names:
  - useFormikForm.ts
  - useAuthStatus.tsx
Dependencies with other folders (none):

## utils/
Purpose: Utility functions.
Responsibilities: Helper functions for common tasks.
What belongs in this folder:
  - dateUtils.ts
  - stringUtils.ts
Example file names:
  - arrayHelpers.ts
  - mathUtils.ts
Dependencies with other folders (none):

## types/
Purpose: Custom TypeScript types and interfaces.
Responsibilities: Defines reusable data structures across the application.
What belongs in this folder:
  - userTypes.ts
  - taskTypes.ts
Example file names:
  - imageTypes.ts
  - formTypes.ts
Dependencies with other folders (none):

## styles/
Purpose: Tailwind CSS utility classes and common styles.
Responsibilities: Ensures consistent styling across components.
What belongs in this folder:
  - globals.css
  - theme.css
Example file names:
  - buttonStyles.css
  - inputStyles.css
Dependencies with other folders (none):

Mermaid diagram showing the dependency flow:

```mermaid
graph TD;
    A-->B;
    B-->C;
    C--->D;
    D--->E;