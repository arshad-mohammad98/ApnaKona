#!/bin/bash

# Restore and search standard macOS paths for Node and NPM
export PATH="/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# If NVM is present, include the latest installed node
if [ -d "$HOME/.nvm/versions/node" ]; then
    LATEST_NVM_NODE=$(ls -1 "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)
    if [ -n "$LATEST_NVM_NODE" ]; then
        export PATH="$HOME/.nvm/versions/node/$LATEST_NVM_NODE/bin:$PATH"
    fi
fi

cd "$(dirname "$0")"

echo "========================================="
echo "  Starting ApnaKona Student Housing App  "
echo "========================================="

# Check for node
if ! command -v node &> /dev/null; then
    # Direct check common locations
    if [ -x "/usr/local/bin/node" ]; then
        export PATH="/usr/local/bin:$PATH"
    elif [ -x "/opt/homebrew/bin/node" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
    fi
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js was not detected yet."
    echo ""
    echo "If you just downloaded the Node.js .pkg file:"
    echo "1. Double-click the downloaded .pkg file in your Downloads folder to run through the installer wizard."
    echo "2. Once installed, re-run this script."
    exit 1
fi

echo "✓ Node.js detected: $(node -v) at $(which node)"
echo "✓ NPM detected:     $(npm -v) at $(which npm)"

# 2. Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing project dependencies (this takes ~30 seconds)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed. Retrying with --legacy-peer-deps..."
        npm install --legacy-peer-deps
    fi
fi

# 3. Create .env.local if not present
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✓ Created .env.local"
    fi
fi

# 4. Start the development server
echo ""
echo "=========================================================="
echo "🚀 Starting Next.js development server..."
echo "👉 Open http://localhost:3000 in your browser once ready!"
echo "=========================================================="
echo ""
npm run dev
