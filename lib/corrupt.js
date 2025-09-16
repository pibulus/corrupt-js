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

  const styles = {
    witchhouse: {
      chars: '▓░▒█⛧☠✠⚸◬◭▪▫◾◽',
      rate: 0.3,
      maxCorruptions: 2
    },
    sparkle: {
      chars: '✨💫⭐🌟✦✧♡◇💖🌈',
      rate: 0.25,
      maxCorruptions: 1
    },
    matrix: {
      chars: '01｜╱╲／＼⌘◊∆∇',
      rate: 0.35,
      maxCorruptions: 3
    },
    glitch: {
      chars: 'xX×⨯※⁂◊!@#$%',
      rate: 0.2,
      maxCorruptions: 2
    },
    zalgo: {
      chars: '̸̵̶̷̴͓͎̺̻̼',
      rate: 0.4,
      maxCorruptions: 4
    },
    melt: {
      chars: '▄▀▐▌▖▗▘▝▚▞',
      rate: 0.3,
      maxCorruptions: 3
    },
    ascii: {
      chars: '@#$%^&*()_+-=',
      rate: 0.25,
      maxCorruptions: 2
    }
  };

  // ===================================================================
  // MAIN CLASS
  // ===================================================================

  class Corrupt {
    constructor(elements, options = {}) {
      this.elements = this.getElements(elements);
      this.options = {
        style: options.style || 'glitch',
        rate: options.rate || null,
        maxCorruptions: options.maxCorruptions || null,
        sticky: options.sticky || false,
        flicker: options.flicker || false,
        wave: options.wave || false,
        preserveSpaces: options.preserveSpaces !== false,
        preserveEnds: options.preserveEnds !== false,
        delay: options.delay || 0
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

        // Set up event handlers
        el.addEventListener('mouseenter', (e) => {
          if (this.options.delay > 0) {
            setTimeout(() => {
              if (el.matches(':hover')) {
                this.corrupt(el, elementStyle, elementRate, elementMax);
              }
            }, this.options.delay);
          } else {
            this.corrupt(el, elementStyle, elementRate, elementMax);
          }
        });

        el.addEventListener('mouseleave', (e) => {
          this.restore(el);
        });
      });
    }

    corrupt(element, styleName, rate, max) {
      const style = styles[styleName] || styles.glitch;
      const text = element.dataset.original || element.textContent;
      const useRate = rate || style.rate;
      const useMax = max || style.maxCorruptions;

      if (this.options.wave) {
        this.waveCorrupt(element, text, style, useRate, useMax);
      } else if (this.options.flicker) {
        this.flickerCorrupt(element, text, style, useRate, useMax);
      } else {
        const corrupted = this.corruptText(text, style.chars, useRate, useMax);
        element.textContent = corrupted;
      }
    }

    corruptText(text, chars, rate, maxCorruptions) {
      let corruptions = 0;
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

    flickerCorrupt(element, text, style, rate, max) {
      let toggle = false;
      const flicker = () => {
        if (toggle) {
          element.textContent = text;
        } else {
          element.textContent = this.corruptText(text, style.chars, rate, max);
        }
        toggle = !toggle;
      };

      const interval = setInterval(flicker, 50);
      this.activeAnimations.set(element, interval);
    }

    waveCorrupt(element, text, style, rate, max) {
      let position = 0;
      const textArray = text.split('');

      const wave = () => {
        const corrupted = [...textArray];
        const waveSize = 3;

        for (let i = 0; i < waveSize; i++) {
          const pos = (position + i) % text.length;
          if (this.options.preserveSpaces && textArray[pos] === ' ') continue;
          corrupted[pos] = style.chars[Math.floor(Math.random() * style.chars.length)];
        }

        element.textContent = corrupted.join('');
        position = (position + 1) % text.length;
      };

      const interval = setInterval(wave, 100);
      this.activeAnimations.set(element, interval);
    }

    restore(element) {
      // Clear any active animations
      if (this.activeAnimations.has(element)) {
        clearInterval(this.activeAnimations.get(element));
        this.activeAnimations.delete(element);
      }

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
    static corruptString(text, style = 'glitch', rate = 0.3, max = 2) {
      const styleConfig = styles[style] || styles.glitch;
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