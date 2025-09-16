/**
 * corrupt.js - Interactive text corruption library
 * v0.1.0
 *
 * A lightweight, framework-agnostic library for adding interactive
 * glitch/corruption effects to text on hover.
 *
 * @author Pablo Alvarado
 * @license MIT
 * @inspiration Inspired by baffle.js but focused on interaction
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Corrupt = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ===================================================================
  // CONFIGURATION
  // ===================================================================

  // ASCII-safe character sets for maximum compatibility
  const safeChars = {
    witch: '#@%&*!?<>/\\|+-=',
    sparkle: '*+.oO',
    matrix: '01|/-_[]{}()=+',
    dots: '.,:;\'"',
    melt: '|_-=~^vV\\/',
    wave: '~≈∿∽〜～'
  };

  // Full Unicode character sets (may show as black squares on some systems)
  const styles = {
    witch: {
      chars: '†‡§¶∞░▒▓█▀▄#%&',
      safeChars: safeChars.witch,
      rate: 0.15,  // Less wild
      maxCorruptions: 1,  // Just one char at a time
      animation: 'shake',
      duration: 600
    },
    matrix: {
      chars: '01|/\\-_[]{}()=+',
      safeChars: safeChars.matrix,
      rate: 0.35,
      maxCorruptions: 3,
      animation: 'typewriter',
      duration: 1200
    },
    sparkle: {
      chars: '✦✧⋆∗◉◎◈◇*+°',
      safeChars: safeChars.sparkle,
      rate: 0.25,
      maxCorruptions: 1,
      animation: 'twinkle',
      duration: 1500
    },
    dots: {
      chars: '•●○◦∘⊙⊚⊛·:',
      safeChars: safeChars.dots,
      rate: 0.2,
      maxCorruptions: 2,
      animation: 'simple',  // Just simple corruption
      duration: 500
    },
    melt: {
      chars: '▼▾▿╱╲╳¦┊┋│',
      safeChars: safeChars.melt,
      rate: 0.2,
      maxCorruptions: 2,
      animation: 'drip',
      duration: 1500
    },
    wave: {
      chars: '~≈∿∽〜～≋≈',
      safeChars: safeChars.wave,
      rate: 0.5,
      maxCorruptions: 5,
      animation: 'wave',
      duration: 600
    }
  };

  // ===================================================================
  // EASING FUNCTIONS
  // ===================================================================

  const easings = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    bounce: t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      else return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    elastic: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 :
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };

  // ===================================================================
  // UNICODE DETECTION
  // ===================================================================

  function canRenderUnicode() {
    // Create a test canvas to check if Unicode renders properly
    if (typeof document === 'undefined') return false;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Test with a Unicode character that commonly shows as black square
    const testChar = '▓';
    ctx.font = '16px sans-serif';
    ctx.fillText(testChar, 0, 16);

    // Check if the character rendered (not empty)
    const imageData = ctx.getImageData(0, 0, 16, 16);
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) {
        // Found non-transparent pixel, character rendered
        return true;
      }
    }
    return false;
  }

  // ===================================================================
  // MAIN CLASS
  // ===================================================================

  class Corrupt {
    constructor(elements, options = {}) {
      this.elements = this.getElements(elements);

      // Auto-detect Unicode support if not explicitly set
      const autoDetectedSafeMode = options.autoDetect !== false ?
        !canRenderUnicode() : false;

      this.options = {
        style: options.style || 'witch',
        rate: options.rate || null,
        maxCorruptions: options.maxCorruptions || null,
        sticky: options.sticky || false,
        preserveSpaces: options.preserveSpaces !== false,
        preserveEnds: options.preserveEnds !== false,
        delay: options.delay || 0,
        duration: options.duration || null,
        cssClass: options.cssClass || 'corrupted-char',
        safeMode: options.safeMode || autoDetectedSafeMode,
        autoDetect: options.autoDetect !== false
      };

      this.activeAnimations = new Map();
      this.init();
    }

    getElements(selector) {
      if (typeof selector === 'string') {
        return Array.from(document.querySelectorAll(selector));
      } else if (selector instanceof NodeList) {
        return Array.from(selector);
      } else if (selector instanceof HTMLElement) {
        return [selector];
      } else if (Array.isArray(selector)) {
        return selector;
      }
      return [];
    }

    init() {
      this.elements.forEach(el => {
        // Store original text
        if (!el.dataset.original) {
          el.dataset.original = el.textContent;
        }

        // Get element-specific config from data attributes
        const elementStyle = el.dataset.corruptStyle || this.options.style;
        const elementRate = el.dataset.corruptRate || this.options.rate;
        const elementMax = el.dataset.corruptChars || this.options.maxCorruptions;
        const elementDuration = el.dataset.corruptDuration || null;

        // Store element-specific options
        el._corruptOptions = {
          style: elementStyle,
          rate: elementRate,
          max: elementMax,
          duration: elementDuration
        };

        // Set up event handlers
        el.addEventListener('mouseenter', () => {
          if (this.options.delay > 0) {
            setTimeout(() => {
              if (el.matches(':hover')) {
                this.corruptWithOptions(el);
              }
            }, this.options.delay);
          } else {
            this.corruptWithOptions(el);
          }
        });

        el.addEventListener('mouseleave', () => {
          this.restore(el);
        });
      });
    }

    corruptWithOptions(element) {
      const opts = element._corruptOptions;
      const style = styles[opts.style] || styles.witch;

      // Use element-specific or style-specific duration
      const duration = parseInt(opts.duration) || style.duration || this.options.duration || 1000;

      // Temporarily override duration if specified
      const originalDuration = this.options.duration;
      this.options.duration = duration;

      // Call the regular corrupt method
      this.corrupt(element, opts.style, opts.rate, opts.max);

      // Restore original duration
      this.options.duration = originalDuration;
    }

    corrupt(element, styleName, rate, max) {
      const style = styles[styleName] || styles.witch;
      const text = element.dataset.original || element.textContent;
      const useRate = rate || style.rate;
      const useMax = max || style.maxCorruptions;

      // Use safe characters if in safe mode
      const chars = this.options.safeMode ? style.safeChars : style.chars;

      // Clear any existing animations
      if (this.activeAnimations.has(element)) {
        const animId = this.activeAnimations.get(element);
        if (typeof animId === 'number') {
          cancelAnimationFrame(animId);
        } else {
          clearInterval(animId);
          clearTimeout(animId);
        }
        this.activeAnimations.delete(element);
      }

      // Store the character set for this corruption
      this._currentChars = chars;

      // Update style with current chars
      const activeStyle = { ...style, chars };

      // Use the style's built-in animation
      switch(style.animation) {
        case 'shake':
          this.shakeCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        case 'typewriter':
          this.typewriterCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        case 'twinkle':
          this.twinkleCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        case 'simple':
          this.simpleCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        case 'drip':
          this.dripCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        case 'wave':
          this.waveCorrupt(element, text, activeStyle, useRate, useMax);
          break;
        default:
          // Simple instant corruption as fallback
          element.textContent = this.corruptText(text, chars, useRate, useMax);
      }
    }

    corruptText(text, chars, rate, maxCorruptions) {
      const textArray = text.split('');
      const positions = [];

      // Collect valid positions for corruption
      textArray.forEach((char, i) => {
        if (this.options.preserveEnds && (i === 0 || i === text.length - 1)) return;
        if (this.options.preserveSpaces && char === ' ') return;
        positions.push(i);
      });

      // Shuffle positions and corrupt up to max
      const shuffled = positions.sort(() => Math.random() - 0.5);
      const toCorrupt = shuffled.slice(0, Math.min(maxCorruptions, Math.floor(positions.length * rate)));

      toCorrupt.forEach(pos => {
        textArray[pos] = chars[Math.floor(Math.random() * chars.length)];
      });

      return textArray.join('');
    }

    // Simple corruption that just randomly changes a few chars
    simpleCorrupt(element, text, style, rate, max) {
      const changeChars = () => {
        const corrupted = this.corruptText(text, style.chars, rate, max);
        element.textContent = corrupted;
      };

      // Change every 200ms for subtle effect
      const interval = setInterval(changeChars, 200);
      this.activeAnimations.set(element, interval);
    }

    waveCorrupt(element, text, style, _rate, _max) {
      let position = 0;
      const textArray = text.split('');
      const charSet = this._currentChars || style.chars;

      const wave = () => {
        const corrupted = [...textArray];
        const waveSize = 3;

        for (let i = 0; i < waveSize; i++) {
          const pos = (position + i) % text.length;
          if (this.options.preserveSpaces && textArray[pos] === ' ') continue;
          corrupted[pos] = charSet[Math.floor(Math.random() * charSet.length)];
        }

        element.textContent = corrupted.join('');
        position = (position + 1) % text.length;
      };

      const interval = setInterval(wave, 100);
      this.activeAnimations.set(element, interval);
    }


    // Shake effect - characters vibrate then corrupt
    shakeCorrupt(element, text, style, rate, max) {
      element.style.display = 'inline-block';
      let shakeCount = 0;
      const maxShakes = 10;

      const shake = () => {
        if (shakeCount < maxShakes) {
          const intensity = (maxShakes - shakeCount) / maxShakes;
          const x = (Math.random() - 0.5) * 4 * intensity;
          const y = (Math.random() - 0.5) * 2 * intensity;
          element.style.transform = `translate(${x}px, ${y}px)`;
          shakeCount++;
          this.activeAnimations.set(element, requestAnimationFrame(shake));
        } else {
          element.style.transform = '';
          const corrupted = this.corruptText(text, style.chars, rate, max);
          element.textContent = corrupted;
        }
      };

      shake();
    }


    // Typewriter corruption
    typewriterCorrupt(element, text, style, rate, _max) {
      const chars = text.split('');
      let position = 0;
      element.textContent = '';

      const type = () => {
        if (position < chars.length) {
          const char = Math.random() < rate ?
            style.chars[Math.floor(Math.random() * style.chars.length)] :
            chars[position];
          element.textContent += char;
          position++;
          this.activeAnimations.set(element, setTimeout(type, 50));
        }
      };

      type();
    }

    // Drip effect - characters fall down
    dripCorrupt(element, text, style, rate, max) {
      const chars = text.split('');
      const dripping = new Set();
      let frame = 0;
      const maxFrames = 20;

      const drip = () => {
        if (frame < maxFrames) {
          // Add new drips
          for (let i = 0; i < chars.length; i++) {
            if (!dripping.has(i) && Math.random() < rate / 5) {
              dripping.add(i);
            }
          }

          // Update dripping characters
          const display = [...chars];
          dripping.forEach(i => {
            if (chars[i] !== ' ') {
              const progress = frame / maxFrames;
              const charIndex = Math.floor(progress * style.chars.length);
              display[i] = style.chars[charIndex % style.chars.length];
            }
          });

          element.textContent = display.join('');
          frame++;
          this.activeAnimations.set(element, requestAnimationFrame(drip));
        } else {
          // Final corruption
          const corrupted = this.corruptText(text, style.chars, rate, max);
          element.textContent = corrupted;
        }
      };

      drip();
    }

    // Twinkle effect - random sparkles
    twinkleCorrupt(element, text, style, rate, max) {
      const chars = text.split('');
      let twinkles = new Set();
      let frame = 0;

      const twinkle = () => {
        // Clear old twinkles
        twinkles.clear();

        // Add new random twinkles
        for (let i = 0; i < max; i++) {
          const pos = Math.floor(Math.random() * chars.length);
          if (chars[pos] !== ' ') {
            twinkles.add(pos);
          }
        }

        // Apply twinkles
        const display = [...chars];
        twinkles.forEach(pos => {
          display[pos] = style.chars[Math.floor(Math.random() * style.chars.length)];
        });

        element.textContent = display.join('');

        if (frame++ < 30) {
          this.activeAnimations.set(element, setTimeout(() => twinkle(), 100));
        }
      };

      twinkle();
    }

    // Helper for partial corruption
    corruptTextPartial(text, chars, numCorruptions) {
      const textArray = text.split('');
      const positions = [];

      textArray.forEach((char, i) => {
        if (this.options.preserveEnds && (i === 0 || i === text.length - 1)) return;
        if (this.options.preserveSpaces && char === ' ') return;
        positions.push(i);
      });

      const shuffled = positions.sort(() => Math.random() - 0.5);
      const toCorrupt = shuffled.slice(0, Math.min(numCorruptions, positions.length));

      toCorrupt.forEach(pos => {
        textArray[pos] = chars[Math.floor(Math.random() * chars.length)];
      });

      return textArray.join('');
    }

    restore(element) {
      // Clear any active animations
      if (this.activeAnimations.has(element)) {
        const animation = this.activeAnimations.get(element);
        if (typeof animation === 'number') {
          // It's either setTimeout or setInterval ID
          clearTimeout(animation);
          clearInterval(animation);
        } else {
          // It's requestAnimationFrame ID
          cancelAnimationFrame(animation);
        }
        this.activeAnimations.delete(element);
      }

      // Reset any styles that might have been applied
      element.style.transform = '';
      element.style.opacity = '';
      element.style.transition = '';
      element.style.display = '';

      const original = element.dataset.original;

      if (this.options.sticky && Math.random() < 0.1) {
        // 10% chance to stay corrupted briefly
        setTimeout(() => {
          element.textContent = original;
        }, 500);
      } else {
        element.textContent = original;
      }
    }

    // ===================================================================
    // STATIC METHODS
    // ===================================================================

    static init(selector = '.corrupt', options = {}) {
      const elements = document.querySelectorAll(selector);
      return new Corrupt(elements, options);
    }

    static addStyle(name, config) {
      styles[name] = config;
    }

    static getStyles() {
      return Object.keys(styles);
    }

    // Utility method for one-off corruption
    static corruptString(text, style = 'witch', rate = 0.3, max = 2) {
      const styleConfig = styles[style] || styles.witch;
      let corruptions = 0;

      return text.split('').map((char, i) => {
        if (i === 0 || i === text.length - 1) return char;
        if (char === ' ') return char;
        if (Math.random() < rate && corruptions < max) {
          corruptions++;
          return styleConfig.chars[Math.floor(Math.random() * styleConfig.chars.length)];
        }
        return char;
      }).join('');
    }
  }

  // ===================================================================
  // AUTO-INITIALIZATION
  // ===================================================================

  if (typeof document !== 'undefined') {
    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        Corrupt.init();
      });
    } else {
      // DOM already loaded
      setTimeout(() => Corrupt.init(), 0);
    }
  }

  return Corrupt;
}));