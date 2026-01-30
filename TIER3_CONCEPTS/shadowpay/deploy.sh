#!/bin/bash

# ShadowPay Deployment Script
# Usage: ./deploy.sh [--dev] [--prod] [--build-all] [--install-all]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default actions
DO_INSTALL=false
DO_BUILD=false
DO_DEPLOY=false
ENV="dev"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --install)
            DO_INSTALL=true
            shift
            ;;
        --build)
            DO_BUILD=true
            shift
            ;;
        --deploy)
            DO_DEPLOY=true
            shift
            ;;
        --dev)
            ENV="dev"
            shift
            ;;
        --prod)
            ENV="prod"
            shift
            ;;
        --all)
            DO_INSTALL=true
            DO_BUILD=true
            DO_DEPLOY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show configuration
echo "╔══════════════════════════════════════════╗"
echo "║        ShadowPay Deployment Script       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Environment: $ENV"
echo "Install: $DO_INSTALL"
echo "Build: $DO_BUILD"
echo "Deploy: $DO_DEPLOY"
echo ""

# Install dependencies
if [ "$DO_INSTALL" = true ]; then
    log_info "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        log_info "Root dependencies installed"
    fi
    
    if [ -d "packages/sdk" ]; then
        cd packages/sdk && npm install && cd ../..
        log_info "SDK dependencies installed"
    fi
    
    if [ -d "packages/cli" ]; then
        cd packages/cli && npm install && cd ../..
        log_info "CLI dependencies installed"
    fi
    
    if [ -d "packages/web" ]; then
        cd packages/web && npm install && cd ../..
        log_info "Web dependencies installed"
    fi
    
    log_info "All dependencies installed"
fi

# Build packages
if [ "$DO_BUILD" = true ]; then
    log_info "Building packages..."
    
    if [ -d "packages/sdk" ]; then
        cd packages/sdk && npm run build && cd ../..
        log_info "SDK built successfully"
    fi
    
    if [ -d "packages/cli" ]; then
        cd packages/cli && npm run build && cd ../..
        log_info "CLI built successfully"
    fi
    
    log_info "All packages built"
fi

# Deploy
if [ "$DO_DEPLOY" = true ]; then
    log_info "Deploying to $ENV environment..."
    
    # Solana program deployment
    if [ -d "programs/shadowpay" ]; then
        log_info "Deploying Solana program..."
        if command -v anchor &> /dev/null; then
            anchor deploy --provider.cluster $ENV
            log_info "Solana program deployed"
        else
            log_warn "Anchor CLI not found, skipping Solana deployment"
        fi
    fi
    
    # Aztec contract deployment
    if [ -d "contracts" ]; then
        log_info "Deploying Aztec contract..."
        if command -v noir &> /dev/null; then
            # Aztec deployment command would go here
            log_info "Aztec contract ready for deployment"
        else
            log_warn "Noir CLI not found, skipping Aztec deployment"
        fi
    fi
    
    log_info "Deployment complete"
fi

log_info "Done!"
