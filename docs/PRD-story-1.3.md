# Nìmata Story 1.3: Project Generation System - Product Requirements Document

**Author:** Eduardo Menéndez
**Date:** 2025-10-18
**Project Level:** 2
**Target Scale:** 5-15 stories, 1-2 epics, focused PRD + solutioning handoff

---

## Goals and Background Context

### Goals

1. **Eliminate Project Setup Friction:** Reduce 2-4 hours of manual TypeScript project setup to <30 seconds through intelligent scaffolding
2. **Enforce Quality Standards:** Ensure all projects start with consistent, opinionated quality tooling and best practices automatically
3. **Accelerate AI-Assisted Development:** Generate persistent AI context files that eliminate hallucinations and provide project-specific guidance to AI assistants
4. **Support Multiple Project Types:** Provide production-ready templates for common TypeScript+Bun project patterns (CLI, web, library, basic)
5. **Enable Team Consistency:** Allow teams to standardize project structure, quality configurations, and AI context across all projects

### Background Context

The modern TypeScript development workflow suffers from significant setup overhead that impacts developer productivity and code quality:

**Current Problems:**

- **Manual Configuration Hell:** 2-4 hours spent configuring ESLint, TypeScript, Prettier, testing frameworks, and build tools
- **Quality Inconsistency:** Different developers and teams use wildly different quality standards and tool configurations
- **AI Context Vacuum:** AI assistants (Claude Code, GitHub Copilot) lack project-specific context, leading to generic suggestions and code patterns
- **Knowledge Transfer Bottlenecks:** New team members struggle with understanding project structure, standards, and conventions
- **Best Practice Gaps:** Manual setup often skips important quality configurations, leading to technical debt

**Market Opportunity:**
The rise of AI-assisted development has created a new requirement: persistent, high-quality AI context that enables AI assistants to provide project-specific, relevant suggestions. Current tools focus on either scaffolding OR AI assistance, but not the integration between them.

### User Research Insights

**Target Users:**

1. **Individual Developers:** Want to start projects quickly with best practices
2. **Development Teams:** Need consistency across projects and team members
3. **Open Source Maintainers:** Require professional project structure and documentation
4. **Junior Developers:** Benefit from guided setup and educational scaffolding
5. **Senior Developers:** Value customization and extensibility

**Key Pain Points:**

- "I spend more time configuring tools than writing code"
- "Every project on my team looks different"
- "AI assistants give me generic advice that doesn't match my project"
- "New team members take weeks to understand our setup"
- "I forget which quality settings to use for each project type"

---

## Requirements

### Functional Requirements

#### FR1: Interactive Project Configuration Wizard

- **FR1.1:** Collect essential project metadata (name, description, author, license)
- **FR1.2:** Guide users through quality level selection (Light/Medium/Strict) with clear explanations of trade-offs
- **FR1.3:** Enable project type selection (Basic/Web/CLI/Library) with descriptions of each type
- **FR1.4:** Support AI assistant selection (Claude Code, GitHub Copilot, both) with benefits explanation
- **FR1.5:** Provide technology stack options for future extensibility
- **FR1.6:** Offer context-sensitive help for each configuration option via `[?]` key
- **FR1.7:** Validate user input with actionable, specific error messages
- **FR1.8:** Support navigation back to previous questions for configuration refinement

#### FR2: Template-Based Project Scaffolding

- **FR2.1:** Support multiple project templates optimized for different use cases
- **FR2.2:** Implement variable substitution engine using `{{variable}}` syntax
- **FR2.3:** Support conditional blocks `{{#if condition}}...{{/if}}` for quality-level variations
- **FR2.4:** Validate template syntax and structure before generation
- **FR2.5:** Generate files with appropriate permissions and executable bits
- **FR2.6:** Provide template registry system for easy addition of new project types
- **FR2.7:** Handle template inheritance and composition for code reuse

#### FR3: Quality Tool Configuration Generation

- **FR3.1:** Generate ESLint configuration based on selected quality level and project type
- **FR3.2:** Create TypeScript configuration optimized for Bun runtime and project requirements
- **FR3.3:** Set up Prettier formatting rules with opinionated defaults
- **FR3.4:** Configure Bun Test runner with appropriate scripts and coverage settings
- **FR3.5:** Generate tool-specific configurations that work together without conflicts
- **FR3.6:** Validate all generated configurations using tool-specific validation

#### FR4: AI Context File Generation

- **FR4.1:** Generate CLAUDE.md file with persistent AI context for Claude Code
- **FR4.2:** Create GitHub Copilot instructions file optimized for Copilot's parsing
- **FR4.3:** Adapt AI content based on selected quality level and project type
- **FR4.4:** Include project structure documentation and coding standards
- **FR4.5:** Provide examples of good and bad code patterns specific to the project
- **FR4.6:** Optimize AI files for quick parsing and relevance (<10KB total)

#### FR5: Command Line Interface Integration

- **FR5.1:** Implement `nimata init` command with both interactive and non-interactive modes
- **FR5.2:** Support command-line flags: `--template`, `--quality`, `--ai`, `--non-interactive`
- **FR5.3:** Provide real-time progress indicators during project generation
- **FR5.4:** Handle errors gracefully with actionable recovery suggestions
- **FR5.5:** Display success message with clear next steps for the user
- **FR5.6:** Integrate seamlessly with existing Nìmata CLI framework

#### FR6: Project Validation and Setup Verification

- **FR6.1:** Validate generated project structure against expected template
- **FR6.2:** Verify that all generated configuration files are syntactically correct
- **FR6.3:** Test that quality tools work correctly in generated project
- **FR6.4:** Ensure test runner executes successfully in generated projects
- **FR6.5:** Validate AI context files are properly formatted and accessible
- **FR6.6:** Provide clear feedback if any validation step fails

### Non-Functional Requirements

#### NFR1: Performance Requirements

- **NFR1.1:** Project generation completes in <30 seconds for medium projects
- **NFR1.2:** Interactive wizard responds to user input within 100ms
- **NFR1.3:** Template processing completes in <1ms per template file
- **NFR1.4:** Memory usage during generation stays <100MB
- **NFR1.5:** CLI command startup time <200ms

#### NFR2: Usability Requirements

- **NFR2.1:** Wizard completes in <15 questions for typical projects
- **NFR2.2:** Clear, concise help text available for all configuration options
- **NFR2.3:** Intelligent defaults work for 80% of common use cases
- **NFR2.4:** Navigation supports forward/back movement with state preservation
- **NFR2.5:** Error messages are specific, actionable, and suggest solutions

#### NFR3: Reliability Requirements

- **NFR3.1:** 99.9% success rate for template generation across all project types
- **NFR3.2:** Graceful handling of missing or corrupted template files
- **NFR3.3:** Validation prevents generation of invalid or broken projects
- **NFR3.4:** Atomic project creation - either complete success or complete rollback
- **NFR3.5:** No file system corruption or permission issues during generation

#### NFR4: Maintainability Requirements

- **NFR4.1:** Template system supports easy addition of new project types
- **NFR4.2:** Quality level configurations are modular and independently maintainable
- **NFR4.3:** Clear separation between template logic and generation logic
- **NFR4.4:** Comprehensive test coverage >90% for all components
- **NFR4.5:** Well-documented template development process for community contributions

#### NFR5: Compatibility Requirements

- **NFR5.1:** Support for macOS, Linux, and Windows operating systems
- **NFR5.2:** Compatibility with Bun 1.3+ runtime
- **NFR5.3:** Integration with TypeScript 5.x compiler and tooling
- **NFR5.4:** Compatibility with existing Node.js ecosystem and package managers
- **NFR5.5:** Support for common shell environments (bash, zsh, PowerShell)

#### NFR6: Security Requirements

- **NFR6.1:** Template validation prevents code injection attacks
- **NFR6.2:** File generation restricted to target project directory
- **NFR6.3:** Sanitization of user input to prevent path traversal attacks
- **NFR6.4:** Generated configurations follow security best practices
- **NFR6.5:** No sensitive information included in AI context files

---

## User Journeys

### Journey 1: New Developer Starting First TypeScript Project

**User Persona:** Sarah, junior developer joining a TypeScript team
**Experience Level:** Beginner with TypeScript, intermediate with programming
**Environment:** macOS, VS Code, wants to use Claude Code

**Scenario:**
Sarah is joining a development team that uses TypeScript and wants to create her first project following team standards. She's heard about AI assistants and wants to use Claude Code but isn't sure how to set it up properly.

**User Journey Steps:**

1. **Discovery** (5 minutes)
   - Sarah learns about Nìmata from team documentation
   - Reads that Nìmata can set up projects with team standards and AI context
   - Decides to try it for her first project

2. **Installation** (2 minutes)
   - Runs `bun install -g nimata`
   - Installation completes successfully
   - Verifies installation with `nimata --version`

3. **Project Initialization** (3 minutes)
   - Creates new directory: `mkdir my-first-project && cd my-first-project`
   - Runs `nimata init`
   - Interactive wizard starts with welcome message

4. **Configuration Collection** (2 minutes)
   - **Project Name:** "my-first-project" (auto-detected from directory)
   - **Description:** "My first TypeScript project with Nìmata"
   - **Author:** "Sarah Chen" (auto-detected from git config)
   - **Quality Level:** Chooses "Medium" after reading explanations
   - **Project Type:** Selects "Basic" for her first project
   - **AI Assistant:** Chooses "Claude Code" (team standard)

5. **Project Generation** (15 seconds)
   - Wizard shows progress bar
   - Files are generated one by one with status updates
   - Success message displays with next steps

6. **Validation** (1 minute)
   - Runs `bun test` - all tests pass
   - Opens VS Code, Claude Code automatically recognizes project context
   - Runs `bun run lint` - no linting errors

7. **Development** (immediate)
   - Starts writing code in src/index.ts
   - Claude Code provides project-specific suggestions
   - All quality tools work seamlessly

**Success Metrics:**

- Total time from start to running code: <10 minutes
- Zero configuration errors during setup
- AI assistant provides relevant, project-aware suggestions
- Generated code passes all quality checks immediately

### Journey 2: Senior Developer Setting Up Team CLI Tool

**User Persona:** Mike, senior tech lead
**Experience Level:** Expert with TypeScript, CLI development
**Environment:** Linux, Vim, uses both Claude Code and GitHub Copilot

**Scenario:**
Mike is creating a new CLI tool for his team and wants to ensure it follows team standards, includes comprehensive quality tooling, and works well with AI assistants for the whole team.

**User Journey Steps:**

1. **Planning** (10 minutes)
   - Mike reviews team standards: Strict quality level, specific tool configurations
   - Decides on project requirements: CLI tool with subcommands, comprehensive testing
   - Plans to use both AI assistants for different team members' preferences

2. **Non-Interactive Setup** (1 minute)
   - Runs command with all flags:

   ```bash
   nimata init team-cli-tool \
     --template=cli \
     --quality=strict \
     --ai=both \
     --description="Team CLI tool for deployment automation" \
     --author="Mike Rodriguez"
   ```

3. **Project Generation** (20 seconds)
   - Nìmata generates CLI-specific structure
   - Quality configurations with strict rules applied
   - AI context files created for both assistants

4. **Customization** (30 minutes)
   - Mike reviews generated structure
   - Adds team-specific subcommand templates
   - Modifies ESLint rules for team-specific patterns
   - Updates AI context files with team conventions

5. **Team Onboarding** (1 week)
   - Commits project to team repository
   - Team members clone and run `bun install && bun test`
   - Everyone gets consistent development environment
   - AI assistants provide team-specific guidance

**Success Metrics:**

- Consistent project setup across entire team
- New team members can start contributing in <1 hour
- Zero quality tool configuration issues
- AI assistants understand team-specific conventions

### Journey 3: Open Source Library Author

**User Persona:** Alex, experienced open source maintainer
**Experience Level:** Expert with TypeScript libraries and npm publishing
**Environment:** macOS, VS Code, uses GitHub Copilot

**Scenario:**
Alex is creating a new TypeScript library for open source distribution and wants to ensure it has professional project structure, comprehensive documentation, and works well for contributors using AI assistants.

**User Journey Steps:**

1. **Project Planning** (15 minutes)
   - Alex defines library scope and API design
   - Plans for TypeScript declaration files and documentation
   - Wants professional npm package setup
   - Plans for community contributions

2. **Library Template Setup** (2 minutes)

   ```bash
   nimata init awesome-typescript-lib \
     --template=library \
     --quality=strict \
     --ai=copilot \
     --description="Awesome TypeScript utility library" \
     --license=MIT
   ```

3. **Library Generation** (25 seconds)
   - Library-specific structure created
   - TypeScript configuration for library development
   - Documentation templates generated
   - npm publishing configuration included

4. **Development Setup** (5 minutes)
   - Alex reviews generated structure
   - Starts implementing library API
   - GitHub Copilot provides context-aware suggestions
   - All quality tools pass from the start

5. **Community Preparation** (30 minutes)
   - Customizes README.md with library-specific information
   - Updates contributing guidelines
   - Verifies AI context helps new contributors
   - Tests npm build and publishing workflow

6. **Release** (ongoing)
   - Contributors easily understand project structure
   - AI assistants help maintain code quality
   - Automated quality checks ensure consistency

**Success Metrics:**

- Professional-looking project structure immediately
- Comprehensive documentation setup
- Easy contributor onboarding process
- AI assistants provide relevant guidance for contributors

---

## UX Design Principles

### Principle 1: Progressive Disclosure

**Rationale:** overwhelm users with too many options leads to decision paralysis and abandoned workflows.

**Implementation:**

- Start with intelligent defaults that work for 80% of cases
- Reveal advanced options only when needed
- Group related options into logical categories
- Use tooltips and help text judiciously

**Example:** Quality level selection shows only the level name initially, with detailed explanation available via `[?]` key.

### Principle 2: Immediate Value

**Rationale:** Users should see value immediately after project generation without additional configuration.

**Implementation:**

- Generated projects work immediately after creation
- All quality tools configured and passing
- Test suite runs successfully out of the box
- AI context files are ready for use

**Example:** After `nimata init`, user can immediately run `bun test` and see passing tests.

### Principle 3: Consistent Mental Model

**Rationale:** Users should be able to predict how the tool will behave based on their existing knowledge.

**Implementation:**

- Follow established CLI conventions (command structure, flag naming)
- Use familiar terminology from existing tools
- Maintain consistency across all wizard steps
- Align with existing Nìmata CLI patterns

**Example:** Flag names like `--quality` and `--template` match user expectations from other tools.

### Principle 4: Forgiving Interface

**Rationale:** Users make mistakes and should be able to recover without starting over.

**Implementation:**

- Allow navigation back to previous questions
- Save progress and allow resumption
- Provide clear undo options for critical decisions
- Validate input early and provide specific error messages

**Example:** User can go back from quality level selection to change project type if needed.

### Principle 5: Speed and Efficiency

**Rationale:** Developer time is valuable, and tools should minimize friction.

**Implementation:**

- Minimize required user input through smart defaults
- Provide fast response times for all interactions
- Batch operations where possible
- Cache expensive operations

**Example:** Auto-detect project name from directory, author from git config.

---

## User Interface Design Goals

### Goal 1: Clean, Readable Terminal Interface

**Design Requirements:**

- Use color strategically for emphasis and visual hierarchy
- Maintain consistent spacing and alignment throughout wizard
- Provide clear visual separation between different sections
- Ensure accessibility for color-blind users through patterns and symbols

**Implementation Strategy:**

- Green for success, blue for information, yellow for warnings, red for errors
- Use unicode symbols (✓ ✗ ⚠ ?) for clear visual indicators
- Maintain consistent padding and indentation patterns
- Provide high-contrast color combinations

### Goal 2: Intuitive Navigation and Interaction

**Design Requirements:**

- Clear instructions for available actions at each step
- Keyboard shortcuts for common operations (navigate, help, quit)
- Visual progress indication throughout the wizard
- Easy access to help and documentation

**Implementation Strategy:**

- Show available keys at bottom of screen ([Enter] Next [?] Help [Esc] Quit)
- Support arrow keys for navigation, Enter for selection
- Progress bar showing current step and total steps
- Context-sensitive help accessible via `[?]` key

### Goal 3: Informative and Actionable Feedback

**Design Requirements:**

- Real-time validation feedback for user input
- Clear error messages with specific, actionable advice
- Progress indicators for long-running operations
- Success confirmation with clear next steps

**Implementation Strategy:**

- Inline validation with immediate feedback
- Error messages that explain what's wrong and how to fix it
- Animated progress indicators for file generation
- Success screen with commands to run next

### Goal 4: Responsive and Adaptive Interface

**Design Requirements:**

- Adapt to different terminal sizes gracefully
- Handle interrupt signals (Ctrl+C) gracefully
- Manage long content with scrolling or pagination
- Maintain state across terminal resizing

**Implementation Strategy:**

- Detect terminal width and adjust layout accordingly
- Implement graceful shutdown with state preservation
- Use pagination for long lists of options
- Save progress to allow resumption after interruption

---

## Epic List

### Epic 1.3-A: Interactive Scaffolding Infrastructure

**Duration:** 5 days
**Priority:** Critical Path

**Stories:**

- **1.3.1:** Interactive CLI Framework (2 days)
- **1.3.2:** Configuration Collection System (2 days)
- **1.3.3:** Template Engine Core (1 day)

**Value:** Enables user interaction and template processing capabilities

### Epic 1.3-B: Multi-Template Project Generation

**Duration:** 6 days
**Priority:** High

**Stories:**

- **1.3.4:** Basic Project Template (1.5 days)
- **1.3.5:** CLI Application Template (1.5 days)
- **1.3.6:** Web Application Template (1.5 days)
- **1.3.7:** Library Package Template (1.5 days)

**Value:** Provides scaffolding for common TypeScript project patterns

### Epic 1.3-C: Quality Tool Configuration

**Duration:** 4 days
**Priority:** High

**Stories:**

- **1.3.8:** ESLint Configuration Generator (1.5 days)
- **1.3.9:** TypeScript Configuration Generator (1 day)
- **1.3.10:** Prettier and Test Configuration (1.5 days)

**Value:** Ensures generated projects have consistent, opinionated quality tooling

### Epic 1.3-D: AI Context Generation

**Duration:** 3 days
**Priority:** Medium

**Stories:**

- **1.3.11:** CLAUDE.md Generator (1.5 days)
- **1.3.12:** Multi-Assistant Context (1.5 days)

**Value:** Enables AI assistants to provide project-specific, relevant guidance

### Epic 1.3-E: Command Integration and User Experience

**Duration:** 3 days
**Priority:** High

**Stories:**

- **1.3.13:** CLI Command Implementation (1.5 days)
- **1.3.14:** Project Validation and UX Polish (1.5 days)

**Value:** Provides complete user experience from command to working project

> **Note:** Detailed story specifications with full acceptance criteria are available in [story-1.3.md](./stories/story-1.3.md)

---

## Out of Scope

### Version 1.0 Exclusions

The following features are explicitly out of scope for Story 1.3 to ensure focused delivery:

#### Project Types Not Included

- **Mobile Applications:** React Native, Flutter, or native mobile development
- **Desktop Applications:** Electron, Tauri, or native desktop development
- **Full-Stack Frameworks:** Next.js, NestJS, or other opinionated frameworks
- **Database Integrations:** Database-specific templates and configurations
- **Cloud Deployments:** Docker, Kubernetes, or cloud provider templates

#### Advanced Features Deferred

- **Template Marketplace:** Community-contributed templates sharing
- **Project Updates:** Updating existing projects with new template versions
- **Interactive Templates:** Templates that ask additional questions during generation
- **Plugin System:** Extensibility through third-party plugins
- **Project Templates from Git:** Scaffolding from remote template repositories

#### AI Features Deferred

- **Real-time AI Integration:** Live AI assistance during project generation
- **AI-Powered Template Suggestions:** Recommending templates based on project description
- **Dynamic AI Context:** Updating AI context files as project evolves
- **Multi-language AI Support:** AI context for languages other than TypeScript

#### Enterprise Features Deferred

- **Team Template Management:** Centralized template management for organizations
- **Policy Enforcement:** Enforcing organizational standards during generation
- **Audit Logging:** Tracking project generation for compliance
- **Integration with IDEs:** VS Code or other IDE extensions

### Future Considerations

These out-of-scope items may be considered for future releases based on user feedback and business priorities:

#### Version 1.1 Potential Features

- Additional project types based on user demand
- Template customization and inheritance system
- Project update and migration capabilities
- Enhanced AI context with project evolution tracking

#### Version 2.0 Potential Features

- Template marketplace and community contributions
- Plugin system for extensibility
- Advanced AI integration features
- Enterprise-grade team management features

---

_This PRD provides the foundation for Story 1.3 development, focusing on delivering immediate value through intelligent project scaffolding while maintaining a clear path for future enhancements based on user feedback and market demands._
