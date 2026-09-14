#!/bin/bash
# Move to the project root directory
cd "$(dirname "$0")"

DEST_DIR="$HOME/Desktop/arshad"
echo "Creating folder: $DEST_DIR..."
mkdir -p "$DEST_DIR"

echo "Copying all project files to $DEST_DIR..."
# Copy all files and directories (excluding .next build cache for fast copy)
rsync -av --exclude='.next' . "$DEST_DIR/"

echo ""
echo "✅ All files have been successfully copied to: $DEST_DIR"
echo ""
read -r -p "Press [ENTER] to close..." _unused
