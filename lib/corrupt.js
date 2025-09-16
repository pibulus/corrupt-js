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
      chars: '░▒▓█▀▄#@%&*!?<>',
      rate: 0.3,
      maxCorruptions: 2
    },
    sparkle: {
      chars: '*+.oO°˚·¨˜`´',
      rate: 0.25,
      maxCorruptions: 1
    },
    matrix: {
      chars: '01|/\\-_[]{}()=+',
      rate: 0.35,
      maxCorruptions: 3
    },
    glitch: {
      chars: 'xX!@#$%^&*?/<>~',
      rate: 0.2,
      maxCorruptions: 2
    },
    zalgo: {
      chars: '̃̂̇̈̊̋̌̍̎̏̐̑̒̓̔',
      rate: 0.4,
      maxCorruptions: 4
    },
    melt: {
      chars: '|_-=~^vV',
      rate: 0.3,
      maxCorruptions: 3
    },
    ascii: {
      chars: '@#$%^&*()_+-=[]{}',
      rate: 0.25,
      maxCorruptions: 2
    },
    binary: {
      chars: '01',
      rate: 0.5,
      maxCorruptions: 5
    },
    hex: {
      chars: '0123456789ABCDEF',
      rate: 0.3,
      maxCorruptions: 3
    },
    dots: {
      chars: '·:;.,¨´`',
      rate: 0.35,
      maxCorruptions: 2
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
        delay: options.delay || 0,
        duration: options.duration || 1000,
        easing: options.easing || 'easeOut',
        mode: options.mode || 'random',
        cssClass: options.cssClass || 'corrupted-char'
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
        el.addEventListener('mouseenter', () => {
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

        el.addEventListener('mouseleave', () => {
          this.restore(el);
        });
      });
    }

    corrupt(element, styleName, rate, max) {
      const style = styles[styleName] || styles.glitch;
      const text = element.dataset.original || element.textContent;
      const useRate = rate || style.rate;
      const useMax = max || style.maxCorruptions;

      // Clear any existing animations
      if (this.activeAnimations.has(element)) {
        cancelAnimationFrame(this.activeAnimations.get(element));
        this.activeAnimations.delete(element);
      }

      // Choose animation mode
      const mode = this.options.mode;
      switch(mode) {
        case 'cascade':
          this.cascadeCorrupt(element, text, style, useRate, useMax);
          break;
        case 'explode':
          this.explodeCorrupt(element, text, style, useRate, useMax);
          break;
        case 'shake':
          this.shakeCorrupt(element, text, style, useRate, useMax);
          break;
        case 'fade':
          this.fadeCorrupt(element, text, style, useRate, useMax);
          break;
        case 'typewriter':
          this.typewriterCorrupt(element, text, style, useRate, useMax);
          break;
        case 'wave':
          this.waveCorrupt(element, text, style, useRate, useMax);
          break;
        case 'flicker':
          this.flickerCorrupt(element, text, style, useRate, useMax);
          break;
        default:
          this.animatedCorrupt(element, text, style, useRate, useMax);
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

    waveCorrupt(element, text, style, _rate, _max) {
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

    // Smooth animated corruption with easing
    animatedCorrupt(element, text, style, _rate, max) {
      const startTime = performance.now();
      const duration = this.options.duration;
      const easing = easings[this.options.easing] || easings.easeOut;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        const corruptionLevel = Math.floor(easedProgress * max);
        const corrupted = this.corruptTextPartial(text, style.chars, corruptionLevel);
        element.textContent = corrupted;

        if (progress < 1) {
          this.activeAnimations.set(element, requestAnimationFrame(animate));
        }
      };

      this.activeAnimations.set(element, requestAnimationFrame(animate));
    }

    // Cascade effect - corruption flows left to right
    cascadeCorrupt(element, text, style, rate, _max) {
      const chars = text.split('');
      let position = 0;
      const speed = 50;

      const cascade = () => {
        if (position < chars.length) {
          if (chars[position] !== ' ' && Math.random() < rate) {
            chars[position] = style.chars[Math.floor(Math.random() * style.chars.length)];
          }
          element.textContent = chars.join('');
          position++;
          this.activeAnimations.set(element, setTimeout(cascade, speed));
        }
      };

      cascade();
    }

    // Explode effect - corruption starts from center
    explodeCorrupt(element, text, style, rate, _max) {
      const chars = text.split('');
      const center = Math.floor(chars.length / 2);
      let radius = 0;
      const maxRadius = Math.ceil(chars.length / 2);

      const explode = () => {
        if (radius <= maxRadius) {
          const leftPos = center - radius;
          const rightPos = center + radius;

          if (leftPos >= 0 && chars[leftPos] !== ' ' && Math.random() < rate) {
            chars[leftPos] = style.chars[Math.floor(Math.random() * style.chars.length)];
          }
          if (rightPos < chars.length && chars[rightPos] !== ' ' && Math.random() < rate) {
            chars[rightPos] = style.chars[Math.floor(Math.random() * style.chars.length)];
          }

          element.textContent = chars.join('');
          radius++;
          this.activeAnimations.set(element, setTimeout(explode, 100));
        }
      };

      explode();
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

    // Fade effect with corruption
    fadeCorrupt(element, text, style, rate, max) {
      element.style.transition = 'opacity 0.3s';
      element.style.opacity = '0';

      setTimeout(() => {
        const corrupted = this.corruptText(text, style.chars, rate, max);
        element.textContent = corrupted;
        element.style.opacity = '1';
      }, 300);
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