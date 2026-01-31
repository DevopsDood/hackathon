#!/bin/zsh
# =============================================================================
# HACKATHON TEAM NAVIGATION SCRIPT
# =============================================================================
# Usage: ./navigate.sh [team-name]
#   - Run without args to see interactive menu
#   - Or pass team name directly: ./navigate.sh privacy-messaging
# =============================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Team definitions
declare -A TEAMS
TEAMS=(
    ["1"]="TEAM-PRIVACY-MESSAGING"
    ["2"]="TEAM-PAYMENTS-STEALTH"
    ["3"]="TEAM-ZK-PRIVACY-TECH"
    ["4"]="TEAM-DEV-TOOLS"
    ["5"]="TEAM-INFRASTRUCTURE"
    ["6"]="TEAM-AI-UNIFIER"
    ["7"]="TEAM-DEFI-PYXEL"
    ["8"]="TEAM-IDENTITY-SIGN"
    ["9"]="TEAM-MCP-AGENTS"
    ["10"]="TEAM-PANELESS-FRAMEWORK"
    ["11"]="TEAM-CONSUMER-PRIVACY"
)

declare -A TEAM_DESC
TEAM_DESC=(
    ["TEAM-PRIVACY-MESSAGING"]="Secure messaging apps with PQ crypto"
    ["TEAM-PAYMENTS-STEALTH"]="Stealth payments & privacy wallets"
    ["TEAM-ZK-PRIVACY-TECH"]="Zero-knowledge proof systems"
    ["TEAM-DEV-TOOLS"]="CLI tools, SDKs, dev utilities"
    ["TEAM-INFRASTRUCTURE"]="DNS, hosting, node infrastructure"
    ["TEAM-AI-UNIFIER"]="AI privacy & inference models"
    ["TEAM-DEFI-PYXEL"]="DeFi & financial applications"
    ["TEAM-IDENTITY-SIGN"]="Digital identity & signing"
    ["TEAM-MCP-AGENTS"]="MCP protocol agents"
    ["TEAM-PANELESS-FRAMEWORK"]="Frameworks & development tools"
    ["TEAM-CONSUMER-PRIVACY"]="Consumer-grade privacy tools"
)

print_header() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║           HACKATHON TEAM NAVIGATION SYSTEM                       ║${NC}"
    echo -e "${CYAN}║              Privacy & Security Focus                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_menu() {
    print_header
    echo -e "${YELLOW}Available Teams:${NC}"
    echo ""
    for i in "${!TEAMS[@]}"; do
        team="${TEAMS[$i]}"
        desc="${TEAM_DESC[$team]}"
        printf "  ${GREEN}%2s${NC}. ${BLUE}%-25s${NC} - %s\n" "$i" "$team" "$desc"
    done
    echo ""
    echo -e "${YELLOW}Quick Access:${NC}"
    echo "  ./navigate.sh <team-folder-name>"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./navigate.sh 1          # Select from menu"
    echo "  ./navigate.sh privacy-messaging  # Direct access"
    echo "  ./navigate.sh all        # Open all team folders in editor"
    echo ""
}

open_in_editor() {
    local folder="$1"
    if [ -d "$folder" ]; then
        echo -e "${GREEN}Opening ${folder}...${NC}"
        code "$folder" 2>/dev/null || open "$folder" 2>/dev/null || echo "Folder: $(pwd)/$folder"
    else
        echo -e "${RED}Folder not found: $folder${NC}"
    fi
}

case "${1:-}" in
    1|privacy-messaging|PRIVACY-MESSAGING)
        open_in_editor "TEAM-PRIVACY-MESSAGING"
        ;;
    2|payments-stealth|PAYMENTS-STEALTH)
        open_in_editor "TEAM-PAYMENTS-STEALTH"
        ;;
    3|zk-privacy-tech|ZK-PRIVACY-TECH)
        open_in_editor "TEAM-ZK-PRIVACY-TECH"
        ;;
    4|dev-tools|DEV-TOOLS)
        open_in_editor "TEAM-DEV-TOOLS"
        ;;
    5|infrastructure|INFRASTRUCTURE)
        open_in_editor "TEAM-INFRASTRUCTURE"
        ;;
    6|ai-unifier|AI-UNIFIER)
        open_in_editor "TEAM-AI-UNIFIER"
        ;;
    7|defi-pixel|DEFI-PYXEL)
        open_in_editor "TEAM-DEFI-PYXEL"
        ;;
    8|identity-sign|IDENTITY-SIGN)
        open_in_editor "TEAM-IDENTITY-SIGN"
        ;;
    9|mcp-agents|MCP-AGENTS)
        open_in_editor "TEAM-MCP-AGENTS"
        ;;
    10|paneless-framework|PANELESS-FRAMEWORK)
        open_in_editor "TEAM-PANELESS-FRAMEWORK"
        ;;
    11|consumer-privacy|CONSUMER-PRIVACY)
        open_in_editor "TEAM-CONSUMER-PRIVACY"
        ;;
    all|ALL)
        print_header
        echo -e "${YELLOW}Opening all team folders...${NC}"
        for team in "${TEAMS[@]}"; do
            open_in_editor "$team"
        done
        ;;
    ""|help|-h|--help)
        print_menu
        ;;
    *)
        # Try partial match
        matched=false
        for team in "${TEAMS[@]}"; do
            if [[ "$team" == *"${1}"* ]]; then
                open_in_editor "$team"
                matched=true
                break
            fi
        done
        if [ "$matched" = false ]; then
            echo -e "${RED}Unknown team: $1${NC}"
            echo ""
            print_menu
        fi
        ;;
esac

echo ""
echo -e "${CYAN}Tip: Run ./navigate.sh without arguments for menu${NC}"

