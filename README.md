# corrupt.js

🔮 Interactive text corruption library. Zero dependencies. Pure vibes.

A lightweight (3.9kb) JavaScript library that adds interactive glitch/corruption effects to text on hover. Like [baffle.js](https://github.com/camwiegert/baffle) but focused on interaction rather than reveal animations.

[**Demo & Playground**](https://corrupt.hexbloop.com) | [**Download**](https://corrupt.hexbloop.com/corrupt.min.js)

## ✨ Features

- 🎨 **7 Built-in Styles** - Witchhouse, Sparkle, Matrix, Glitch, Zalgo, Melt, ASCII
- 🪶 **Lightweight** - 3.9kb minified, zero dependencies
- 🎯 **Simple API** - Just add a class to any element
- ⚡ **Interactive** - Corrupts on hover, not just on reveal
- 🔧 **Customizable** - Control rate, characters, effects
- 📦 **Framework Agnostic** - Works everywhere (React, Vue, Svelte, vanilla)
- 🎭 **Effects** - Flicker, wave, sticky corruption modes

## 🚀 Quick Start

```html
<!-- 1. Include the library -->
<script src="https://cdn.jsdelivr.net/gh/pibulus/corrupt-js@latest/lib/corrupt.min.js"></script>

<!-- 2. Add the class -->
<h1 class="corrupt">HOVER ME</h1>

<!-- That's it! 🎉 -->
```

## 📖 Installation

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/pibulus/corrupt-js@latest/lib/corrupt.min.js"></script>
```

### NPM
```bash
npm install corrupt-js
```

### Download
[corrupt.min.js](https://corrupt.hexbloop.com/corrupt.min.js) (3.9kb)

## 🎨 Styles

### Built-in Styles

```html
<span class="corrupt" data-corrupt-style="witchhouse">WITCHHOUSE</span>
<span class="corrupt" data-corrupt-style="sparkle">SPARKLE</span>
<span class="corrupt" data-corrupt-style="matrix">MATRIX</span>
<span class="corrupt" data-corrupt-style="glitch">GLITCH</span>
<span class="corrupt" data-corrupt-style="zalgo">ZALGO</span>
<span class="corrupt" data-corrupt-style="melt">MELT</span>
<span class="corrupt" data-corrupt-style="ascii">ASCII</span>
```

### Style Characters

| Style | Characters | Vibe |
|-------|------------|------|
| `witchhouse` | ▓░▒█⛧☠✠⚸◬◭ | Dark occult aesthetic |
| `sparkle` | ✨💫⭐🌟✦✧♡◇ | Cute chaos energy |
| `matrix` | 01｜╱╲／＼⌘◊ | Digital rain effect |
| `glitch` | xX×⨯※⁂◊!@#$ | Classic corruption |
| `zalgo` | ̸̵̶̷̴͓͎̺̻̼ | Cursed text |
| `melt` | ▄▀▐▌▖▗▘▝▚▞ | Dripping pixels |
| `ascii` | @#$%^&*()_+- | Basic ASCII noise |

## 💻 Programmatic Usage

### Basic
```javascript
// Apply to all elements with class
Corrupt.init('.corrupt');

// Or specific element
const element = document.querySelector('.my-text');
new Corrupt(element, {
  style: 'matrix',
  rate: 0.3,
  maxCorruptions: 2
});
```

### With Options
```javascript
new Corrupt('.my-text', {
  style: 'witchhouse',      // Corruption style
  rate: 0.3,                // Chance per character (0-1)
  maxCorruptions: 2,        // Max characters to corrupt
  sticky: true,             // 10% chance to stay corrupted
  flicker: true,            // Rapidly alternate states
  wave: false,              // Wave-like corruption spread
  delay: 200,               // Delay before corruption (ms)
  preserveSpaces: true,     // Don't corrupt spaces
  preserveEnds: true        // Don't corrupt first/last character
});
```

## 🎮 Data Attributes

Control corruption via HTML attributes:

```html
<span
  class="corrupt"
  data-corrupt-style="sparkle"
  data-corrupt-rate="0.5"
  data-corrupt-chars="3"
>
  Customized Corruption
</span>
```

## 🎯 Framework Examples

### React
```jsx
import { useEffect } from 'react';
import Corrupt from 'corrupt-js';

function GlitchText({ children }) {
  useEffect(() => {
    Corrupt.init();
  }, []);

  return <h1 className="corrupt">{children}</h1>;
}
```

### Vue
```vue
<template>
  <h1 class="corrupt">{{ text }}</h1>
</template>

<script>
import Corrupt from 'corrupt-js';

export default {
  mounted() {
    Corrupt.init();
  }
}
</script>
```

### Svelte
```svelte
<script>
  import { onMount } from 'svelte';
  import Corrupt from 'corrupt-js';

  onMount(() => {
    Corrupt.init();
  });
</script>

<h1 class="corrupt">Hover me!</h1>
```

## 🛠️ API Reference

### `Corrupt.init(selector, options)`
Initialize corruption on elements matching selector.

### `new Corrupt(elements, options)`
Create corruption instance for specific elements.

### `Corrupt.addStyle(name, config)`
Add custom corruption style.

```javascript
Corrupt.addStyle('custom', {
  chars: '◆◇○●□■△▽',
  rate: 0.4,
  maxCorruptions: 3
});
```

### `Corrupt.corruptString(text, style, rate, max)`
One-off text corruption (returns corrupted string).

## 🎭 Effects

### Flicker Effect
```javascript
new Corrupt('.text', {
  flicker: true  // Rapidly alternate between normal and corrupted
});
```

### Wave Effect
```javascript
new Corrupt('.text', {
  wave: true  // Corruption spreads like a wave
});
```

### Sticky Corruption
```javascript
new Corrupt('.text', {
  sticky: true  // 10% chance to stay corrupted after hover
});
```

## 🤝 Contributing

PRs welcome! This is a simple library that does one thing well.

## 📄 License

MIT

## 🙏 Credits

Inspired by [baffle.js](https://github.com/camwiegert/baffle) but focused on interaction over animation.

Made with chaos by [Pablo](https://github.com/pibulus)

---

**Why does this exist?** Because text should glitch when you hover it. That's it. That's the whole philosophy.
