#!/bin/bash
cd "$(dirname "$0")"
/bin/bash ./run.sh
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "Process ended with code $EXIT_CODE."
    read -r -p "Press [ENTER] to close this window..." _unused
fi
