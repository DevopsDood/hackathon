#!/bin/bash

# Quantum Terminal (choom.chat) - Vercel Deployment Script
# Hackathon Submission - Deadline: January 30, 2026

echo "🚀 Deploying Quantum Terminal to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    echo "  vercel login"
    echo ""
    echo "Or deploy via Vercel Dashboard:"
    echo "  1. Go to https://vercel.com"
    echo "  2. Sign in / Sign up"
    echo "  3. Click 'Add New Project'"
    echo "  4. Drag this folder to deploy"
    exit 1
fi

# Deploy to Vercel
echo "📡 Deploying to Vercel production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Copy your deployment URL"
echo "  2. Update README.md with the live URL"
echo "  3. Submit to hackathon:
echo "     - Post-Quantum: https://hackathon.example.com/pq"
echo "     - Innovation: https://hackathon.example.com/innovation"
