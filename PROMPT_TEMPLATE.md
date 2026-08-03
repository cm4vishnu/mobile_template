# Purpose
A standardized prompt system is critical for maintaining consistency within this multi-developer, AI-assisted framework. It ensures that every generated feature adheres to the established architecture, follows specific coding standards, utilizes existing components rather than recreating them, and minimizes technical debt by enforcing strict adherence to the project's core guidelines.

# Workflow
1. **Read Framework Documentation**: Always begin by reviewing the local markdown files describing the tech stack, folder structure, and architectural rules.
2. **Understand the Requested Task**: Analyze the user's requirements to define the scope of work.
3. **Review Existing Project Files**: Scan relevant components, pages, and services before generating any code.
4. **Reuse Existing Code**: Identify and use existing types, hooks, or UI components instead of creating new ones.
5. **Modify Existing Files First**: Update current files to incorporate changes before creating new file entries.
6. **Preserve Architecture**: Ensure no structural changes are made unless explicitly requested for a major refactor.
7. **Produce Complete Implementations**: Deliver full, ready-to-use code blocks that don't require "filling in the blanks."

# Required Context
Every implementation must first read and follow these governing documents:
* AI_RULES.md
* ARCHITECTURE.md
* TECH_STACK.md
* DATABASE_RULES.md
* CODING_STYLE.md
* FOLDER_STRUCTURE.md

# Standard Prompt Template

**ROLE:** [e.g., Principal Software Engineer / UI Designer] - *Identity of the AI.*
**PROJECT:** [Description of the app/framework] - *Context of the project.*
**TASK:** [Summary of what needs to be built/fixed]. - *The specific objective.*
**OBJECTIVES:** [Bullet points of high-level goals]. - *Success criteria.*
**FILE OPERATION:** [instructions on which files to create or modify]. - *Actionable file manipulation instructions.*
**TECH STACK:** [React, TypeScript, Tailwind, Capacitor, etc.] - *Language and tool constraints.*
**ARCHITECTURE:** [Component rules, service layering, state management]. - *Structural constraints.*
**RULES:** [Coding style, naming conventions, performance requirements]. - *Mandatory constraints.*
**OUTPUT:** [Specific format for code blocks or summary description]. - *Expected response style.*

# AI Development Rules
- **No Architectural Drift**: Never invent new architecture. Stay within the definitions in ARCHITECTURE.md.
- **Approved Technologies Only**: Do not introduce libraries or frameworks not listed in TECH_STACK.md.
- **Maximum Code Reuse**: Always check `src/components` and `src/hooks` before creating new files.
- **Granular Changes**: Keep changes minimal and focused only on the task at hand.
- **Backward Compatibility**: Ensure updates do not break existing features or routes.
- **Separation of Concerns**: Strictly separate UI components, data services, and business logic (use hooks/services).
- **Consistency over Preference**: Follow the project's established coding style even if a different approach is personally preferred.

# Feature Implementation Checklist
- [ ] Does the implementation fulfill all user requirements?
- [ ] Are Tailwind classes used for layout/spacing as per design guidelines?
- [ ] Is TypeScript properly typed (no `any` unless explicitly allowed)?
- [ ] Are existing components from `src/components` utilized where possible?
- [ ] Is the logic separated into hooks or services if it's complex?
- [ ] Does the code follow the folder structure in FOLDER_STRUCTURE.md?

# Code Review Checklist
- [ ] No linting errors or TypeScript warnings.
- [ ] No unused imports or variables.
- [ ] consistent naming conventions (PascalCase for components, camelCase for functions).
- [ ] No commented-out code blocks.
- [ ] Accessibility features included where applicable (aria-labels).

# Future Improvements
This prompt template will evolve as the framework grows to include more specific instructions for:
1. Integration of new 3rd-party SDKs.
2. More granular UI component guidelines based on updated shadcn/ui usage.
3. Specific performance optimization rules for mobile (Capacitor).