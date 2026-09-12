#!/bin/bash

# Ensure standard macOS paths for Node, NPM, and Homebrew
for p in \
    "/usr/local/bin" \
    "/opt/homebrew/bin" \
    "/opt/homebrew/sbin" \
    "/usr/bin" \
    "/bin" \
    "/usr/sbin" \
    "/sbin" \
    "$HOME/.nvm/versions/node/"*"/bin" \
    "$HOME/.fnm/current/bin" \
    "$HOME/.volta/bin" \
    "$HOME/.asdf/shims" \
    "/opt/homebrew/opt/node/bin" \
    "/usr/local/opt/node/bin"; do
    if [ -d "$p" ]; then
        export PATH="$p:$PATH"
    fi
done

cd "$(dirname "$0")"

echo "=========================================================="
echo "          🏠 ApnaKona — Student Housing Portal            "
echo "=========================================================="
echo ""

# Helper to check if node works
check_node() {
    command -v node &> /dev/null && command -v npm &> /dev/null
}

if ! check_node; then
    # Try finding node binary directly
    for candidate in /usr/local/bin/node /opt/homebrew/bin/node; do
        if [ -x "$candidate" ]; then
            NODE_DIR="$(dirname "$candidate")"
            export PATH="$NODE_DIR:$PATH"
            break
        fi
    done
fi

if ! check_node; then
    echo "⚠️  Node.js was not detected on your Mac."
    echo ""
    echo "If you already ran the Node.js installer:"
    echo "1. Run this in Terminal once to link Node:"
    echo "   echo 'export PATH=\"/usr/local/bin:/opt/homebrew/bin:\$PATH\"' >> ~/.zshrc"
    echo ""
    echo "If you haven't installed Node.js yet:"
    echo "👉 Opening https://nodejs.org in your browser..."
    open "https://nodejs.org/en/download" 2>/dev/null || true
    echo ""
    read -r -p "Press [ENTER] to exit..." _unused
    exit 1
fi

echo "✓ Node.js detected: $(node -v) ($(which node))"
echo "✓ NPM detected:     $(npm -v) ($(which npm))"
echo ""

# 2. Check and install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing project dependencies (first time setup)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Retrying with --legacy-peer-deps..."
        npm install --legacy-peer-deps
    fi
    echo ""
fi

# 3. Create .env.local if missing
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✓ Created .env.local"
    fi
fi

# 4. Start the Next.js dev server & open browser
echo "=========================================================="
echo "🚀 Starting Next.js server..."
echo "👉 Opening http://localhost:3000 in your browser..."
echo "=========================================================="
echo ""

(sleep 3 && open http://localhost:3000 2>/dev/null) &
npm run dev

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "Server stopped with exit code $EXIT_CODE."
    read -r -p "Press [ENTER] to exit..." _unused
fi
