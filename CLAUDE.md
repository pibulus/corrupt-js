# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

corrupt.js is an interactive text corruption library (3.9kb, zero dependencies) that adds glitch/corruption effects to text on hover. The project includes both the core JavaScript library and a Fresh (Deno) demo site showcasing the library's capabilities.

## Architecture

### Core Library (`/lib/`)
- **corrupt.js**: Main library file using UMD pattern for universal compatibility
- **corrupt.min.js**: Minified production version (3.9kb)
- Framework-agnostic, works with vanilla JS, React, Vue, Svelte, etc.
- **6 focused styles**: witch, matrix, sparkle, dots, melt, wave
- Each style has its own built-in animation (no separate mode selection needed)

### Demo Site (Fresh/Deno)
- **`/routes/`**: Fresh pages (index.tsx main demo page)
- **`/islands/`**: Interactive components (Playground.tsx for testing)
- **`/static/`**: Static assets including library downloads
- Runs on port 8001 by default

## Development Commands

### Demo Site Development
```bash
# Start development server (port 8001)
deno task start   # or deno task dev

# Build for production
deno task build

# Preview production build
deno task preview

# Run format, lint, and type checking
deno task check
```

### Library Development
```bash
# Minify the library after changes
npm run minify   # Uses esbuild to create corrupt.min.js

# The library is served at:
# - /corrupt.js (development)
# - /corrupt.min.js (production)
```

## Testing Changes

To test library modifications:
1. Edit `/lib/corrupt.js`
2. Run `npm run minify` to update the minified version
3. The demo site auto-reloads and uses the local library version
4. Test at http://localhost:8001

## Key Implementation Details

### Library API Structure
- `Corrupt.init(selector, options)`: Initialize on matching elements
- `new Corrupt(elements, options)`: Create instance for specific elements
- `Corrupt.addStyle(name, config)`: Add custom corruption styles
- `Corrupt.corruptString(text, style, rate, max)`: One-off corruption

### Corruption Styles Configuration
Each style in `/lib/corrupt.js` defines:
- `chars`: Unicode characters for corruption
- `safeChars`: ASCII-safe fallback characters
- `rate`: Probability of corruption per character (0-1)
- `maxCorruptions`: Max characters to corrupt simultaneously
- `animation`: Built-in animation type (shake, typewriter, twinkle, simple, drip, wave)
- `duration`: Animation duration in milliseconds

### Style Animations
- **witch**: shake animation with occult characters
- **matrix**: typewriter effect with binary/symbols
- **sparkle**: twinkle animation with star characters
- **dots**: simple random corruption with dot variations
- **melt**: drip animation with vertical characters
- **wave**: flowing wave effect across text

### Demo Site Components
- **Playground Island** (`/islands/Playground.tsx`): Simplified interactive testing
- Two main controls: Intensity (0-100%) and Speed (0-100%)
- Style selection via visual buttons
- Live preview and code export functionality

## Deployment

The demo site is deployed at https://corrupt.hexbloop.com via Deno Deploy.
The library is distributed via:
- NPM: `corrupt-js` package
- CDN: jsDelivr auto-serves from GitHub
- Direct download from demo site