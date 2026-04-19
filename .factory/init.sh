#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Install dependencies (idempotent)
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  npm install --legacy-peer-deps
fi

echo "Environment ready."
