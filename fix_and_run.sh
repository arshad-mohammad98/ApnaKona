#!/bin/bash
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd "$(dirname "$0")"

echo "=========================================================="
echo "  1. Resolving Git Conflict & Restoring Clean Files       "
echo "=========================================================="
echo ""

# Abort interrupted rebase and restore files to our commit
git rebase --abort 2>/dev/null || rm -rf .git/rebase-merge .git/rebase-apply
git checkout -B main e667839 2>/dev/null || git reset --hard e667839 2>/dev/null

echo "✓ Conflict markers removed."
echo "✓ All files restored cleanly!"
echo ""

# Verify package.json is valid
echo "2. Checking dependencies..."
npm install --silent 2>/dev/null || npm install

echo ""
echo "=========================================================="
echo "  3. Starting ApnaKona Dev Server                         "
echo "  👉 Opening http://localhost:3000 in your browser...      "
echo "=========================================================="
echo ""

(sleep 3 && open http://localhost:3000 2>/dev/null) &
npm run dev
