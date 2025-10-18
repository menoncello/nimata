# Nìmata Scripts

Utility scripts for the Nìmata project.

---

## BMAD Agent Rebuild Script

**Location:** `scripts/rebuild-bmad-agents.sh`

Rebuilds BMAD agents using the bmad-cli tool from the BMAD6 repository.

### Prerequisites

- BMAD6 repository cloned at: `/Users/menoncello/repos/oss/bmad6`
- Node.js installed
- Nìmata project at: `/Users/menoncello/repos/dev/nimata`

### Usage

#### Option 1: Rebuild All Agents

```bash
# Using script directly
./scripts/rebuild-bmad-agents.sh --all

# Using bun script (from project root)
bun run bmad:rebuild
```

#### Option 2: Rebuild Specific Agent

```bash
# Using script directly
./scripts/rebuild-bmad-agents.sh <agent-name>

# Examples:
./scripts/rebuild-bmad-agents.sh dev
./scripts/rebuild-bmad-agents.sh tea
./scripts/rebuild-bmad-agents.sh architect
```

#### Option 3: Show Help

```bash
./scripts/rebuild-bmad-agents.sh
```

### Available Agents

Based on files in `bmad/bmm/agents/`:

- `analyst` - Business Analyst agent
- `architect` - Solution Architect agent
- `dev` - Development agent
- `pm` - Product Manager agent
- `sm` - Scrum Master agent
- `tea` - Master Test Architect agent (Murat)
- `ux-expert` - UX Expert agent

### How It Works

The script wraps the BMAD CLI build command:

```bash
node /Users/menoncello/repos/oss/bmad6/tools/cli/bmad-cli.js build [agent-name]
```

**Build Process:**

1. Verifies bmad-cli exists
2. Runs build command for specified agent(s)
3. Displays colored output for success/failure
4. Returns exit code 0 on success, 1 on failure

### Output Example

```
╔════════════════════════════════════════╗
║   BMAD Agent Rebuild Script           ║
╚════════════════════════════════════════╝

✓ Found bmad-cli
✓ Project directory: /Users/menoncello/repos/dev/nimata

→ Building agent: dev

Using project: /Users/menoncello/repos/dev/nimata

🔨 Building Agent Files

  Building dev...
  ✓ dev built successfully

✓ dev rebuilt successfully!
════════════════════════════════════════
```

### Exit Codes

- `0` - Success
- `1` - Failure (bmad-cli not found, build failed, etc.)

### Configuration

Edit the script to change default paths:

```bash
# Configuration
BMAD_CLI="/Users/menoncello/repos/oss/bmad6/tools/cli/bmad-cli.js"
PROJECT_DIR="/Users/menoncello/repos/dev/nimata"
```

---

## Future Scripts

This directory will contain additional utility scripts for:

- Test automation
- Build optimization
- CI/CD helpers
- Development workflows
