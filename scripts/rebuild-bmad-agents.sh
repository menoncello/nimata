#!/bin/bash

# BMAD Agent Rebuild Script
# Rebuilds all BMAD agents using bmad-cli

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BMAD_CLI="/Users/menoncello/repos/oss/bmad6/tools/cli/bmad-cli.js"
PROJECT_DIR="/Users/menoncello/repos/dev/nimata"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   BMAD Agent Rebuild Script           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verify bmad-cli exists
if [ ! -f "$BMAD_CLI" ]; then
  echo -e "${RED}✗ Error: bmad-cli not found at $BMAD_CLI${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found bmad-cli${NC}"
echo -e "${GREEN}✓ Project directory: $PROJECT_DIR${NC}"
echo ""

# Option 1: Rebuild all agents
if [ "$1" == "--all" ] || [ "$1" == "-a" ]; then
  echo -e "${YELLOW}→ Rebuilding all agents...${NC}"
  echo ""

  if node "$BMAD_CLI" build --all --directory "$PROJECT_DIR" 2>&1; then
    echo ""
    echo -e "${GREEN}✓ All agents rebuilt successfully!${NC}"
  else
    echo ""
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
  fi

# Option 2: Rebuild specific agent
elif [ -n "$1" ]; then
  AGENT="$1"
  echo -e "${YELLOW}→ Building agent: ${AGENT}${NC}"
  echo ""

  if node "$BMAD_CLI" build "$AGENT" --directory "$PROJECT_DIR" 2>&1; then
    echo ""
    echo -e "${GREEN}✓ ${AGENT} rebuilt successfully!${NC}"
  else
    echo ""
    echo -e "${RED}✗ ${AGENT} build failed${NC}"
    exit 1
  fi

# Option 3: Show usage
else
  echo -e "${YELLOW}Usage:${NC}"
  echo -e "  ${0} --all              Rebuild all agents"
  echo -e "  ${0} <agent-name>       Rebuild specific agent"
  echo ""
  echo -e "${YELLOW}Examples:${NC}"
  echo -e "  ${0} --all"
  echo -e "  ${0} tea"
  echo -e "  ${0} dev"
  echo ""
  exit 0
fi

echo -e "${BLUE}════════════════════════════════════════${NC}"
