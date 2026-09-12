#!/bin/bash

# Ensure standard macOS paths
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

cd "$(dirname "$0")"

REPO_URL="https://github.com/arshad-mohammad98/ApnaKona.git"

echo "=========================================================="
echo "  Pushing ApnaKona to GitHub: $REPO_URL"
echo "=========================================================="
echo ""

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed or not in PATH."
    exit 1
fi

echo "✓ Git detected: $(git --version)"

# 1. Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing new Git repository..."
    git init
fi

# 2. Configure remote origin
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$CURRENT_REMOTE" ]; then
    echo "Adding remote origin: $REPO_URL"
    git remote add origin "$REPO_URL"
elif [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
    echo "Updating remote origin to: $REPO_URL"
    git remote set-url origin "$REPO_URL"
else
    echo "✓ Remote origin is set to $REPO_URL"
fi

# 3. Ensure branch is main
git checkout -B main 2>/dev/null || git branch -M main

# 4. Stage all files
echo "Staging all project files..."
git add -A

# 5. Commit changes if any
STATUS=$(git status --porcelain)
if [ -n "$STATUS" ]; then
    echo "Committing updates..."
    git commit -m "feat: Add Greater Noida hub, dark theme, interactive Google Maps, search palette & area filters"
else
    echo "✓ All files already committed."
fi

# 6. Push cleanly with force to avoid rebase merge conflicts
echo ""
echo "🚀 Pushing to GitHub (origin main)..."
echo "ℹ️  If prompted for credentials:"
echo "    - Username: Your GitHub username (the collaborator account)"
echo "    - Password: Your GitHub Personal Access Token (PAT) with 'repo' scope"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================================="
    echo "🎉 SUCCESS: Project pushed to $REPO_URL on branch main!"
    echo "=========================================================="
else
    echo ""
    echo "❌ Push failed. Please check your GitHub collaborator permissions or Personal Access Token."
fi
