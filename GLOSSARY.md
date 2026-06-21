# GLOSSARY.md

## Library Core
**corrupt.js** - Main UMD library (270 lines)
**corrupt.min.js** - Minified production version (3.9kb)

## Islands
**Playground** - Interactive demo/testing component with live preview and code export

## Routes
**index.tsx** - Main demo page showcasing all corruption styles

## Library API
**Corrupt.init(selector, options)** - Initialize on CSS selector
**new Corrupt(elements, options)** - Create instance for specific elements
**Corrupt.addStyle(name, config)** - Register custom corruption style
**Corrupt.corruptString(text, style, rate, max)** - One-off corruption without DOM
**Corrupt.cutupString(text, intensity)** - One-off Burroughs cut-up word rearrangement

## Corruption Styles
**witch** - Occult characters (†‡§¶•), shake animation (800ms)
**matrix** - Binary/symbols (01|/\-_), typewriter animation (1200ms)
**sparkle** - Star characters (✦✧⋆∗◉), twinkle animation (1500ms)
**dots** - Dot variations (•●○◦∘), twinkle animation (800ms)
**melt** - Vertical chars (▼▾▿╱╲), drip animation (1500ms)
**wave** - Wave symbols (~≈∿∽), flowing wave animation (600ms)
**burroughs** - Cut-up word rearrangement + char corruption, cutup animation (2000ms)
**collapse** - Progressive glitch→decay→sigil degradation with screen shake (2500ms)

## Style Config
**chars** - Unicode corruption characters
**safeChars** - ASCII fallback for compatibility
**rate** - Corruption probability per char (0-1)
**maxCorruptions** - Max simultaneous corrupted chars
**animation** - Built-in animation type
**duration** - Animation time in milliseconds

## Animation Types
**shake** - Rapid position jitter
**typewriter** - Sequential char replacement
**twinkle** - Fade in/out sparkle effect
**simple** - Random character swaps
**drip** - Vertical cascade effect
**wave** - Horizontal flowing pattern
**cutup** - Word-level rearrangement with progressive char corruption
**collapse** - Three-phase degradation: glitch → block decay → abstract sigil

## Easing Functions
**linear**, **easeIn**, **easeOut**, **easeInOut**, **bounce**, **elastic** - Animation timing curves

## Concepts
**UMD pattern** - Universal module definition (works in AMD/CommonJS/browser)
**Framework-agnostic** - Vanilla JS, works with React/Vue/Svelte/etc
**Hover-triggered** - Effects activate on mouseover, restore on mouseout
**Unicode fallback** - Auto-switches to ASCII-safe chars if Unicode unsupported
**Zero dependencies** - Pure JavaScript, no external libs
