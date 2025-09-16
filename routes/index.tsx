import { Head } from "$fresh/runtime.ts";
import Playground from "../islands/Playground.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>corrupt.js - Interactive Text Corruption</title>
        <meta name="description" content="A lightweight library for adding interactive glitch effects to text on hover" />
        <script src="/corrupt.js"></script>
        <style>{`
          .corrupted-char {
            color: #ff00ff;
            text-shadow: 0 0 5px rgba(255,0,255,0.8);
            animation: glitch 0.1s infinite alternate;
          }

          @keyframes glitch {
            0% { transform: translate(0); }
            100% { transform: translate(1px, -1px); }
          }

          .corrupt:hover {
            cursor: pointer;
            filter: contrast(1.2) brightness(1.1);
          }
        `}</style>
      </Head>

      <div class="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
        {/* Hero Section */}
        <header class="container mx-auto px-4 py-16 text-center">
          <h1 class="text-5xl sm:text-6xl md:text-8xl font-black mb-4 tracking-tight">
            <span class="corrupt" data-corrupt-style="witchhouse">
              CORRUPT
            </span>
            <span class="text-pink-500">.</span>
            <span class="corrupt" data-corrupt-style="sparkle">
              JS
            </span>
          </h1>

          <p class="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 font-medium max-w-2xl mx-auto">
            Interactive text corruption on hover. Zero dependencies. Pure vibes.
          </p>

          <div class="flex gap-4 justify-center flex-wrap">
            <a
              href="/corrupt.min.js"
              download
              class="px-6 sm:px-8 py-3 bg-black text-white font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all corrupt"
              data-corrupt-style="glitch"
            >
              DOWNLOAD
            </a>
            <a
              href="https://github.com/pibulus/corrupt-js"
              class="px-6 sm:px-8 py-3 bg-white text-black font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all corrupt"
              data-corrupt-style="matrix"
            >
              GITHUB
            </a>
          </div>

          <div class="mt-8 text-sm text-gray-600">
            <span class="corrupt" data-corrupt-style="melt">3.9kb minified</span>
            <span class="mx-2">•</span>
            <span class="corrupt" data-corrupt-style="ascii">Zero dependencies</span>
            <span class="mx-2">•</span>
            <span class="corrupt" data-corrupt-style="zalgo">MIT License</span>
          </div>
        </header>

        {/* Examples Grid */}
        <section class="container mx-auto px-4 py-12">
          <h2 class="text-3xl font-black mb-8 text-center">Built-in Styles</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { style: 'witchhouse', text: 'WITCHHOUSE', desc: 'Dark occult vibes • Shakes violently' },
              { style: 'sparkle', text: 'SPARKLE', desc: 'Cute chaos • Cascades left to right' },
              { style: 'matrix', text: 'MATRIX', desc: 'Digital rain • Types out corruption' },
              { style: 'glitch', text: 'GLITCH', desc: 'Classic corruption • Rapid flicker' },
              { style: 'zalgo', text: 'ZALGO', desc: 'Cursed text • Explodes from center' },
              { style: 'melt', text: 'MELT', desc: 'Dripping pixels • Fades in/out' },
            ].map(({ style, text, desc }) => (
              <div
                key={style}
                class="bg-white rounded-lg border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <h3
                  class="text-2xl font-black mb-2 corrupt cursor-pointer"
                  data-corrupt-style={style}
                >
                  {text}
                </h3>
                <p class="text-gray-600">{desc}</p>
                <code class="block mt-3 text-xs bg-gray-100 p-2 rounded">
                  data-corrupt-style="{style}"
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Playground */}
        <section class="container mx-auto px-4 py-12">
          <h2 class="text-3xl font-black mb-8 text-center">Playground</h2>
          <Playground />
        </section>

        {/* Quick Start */}
        <section class="container mx-auto px-4 py-12 max-w-4xl">
          <h2 class="text-3xl font-black mb-8 text-center">Quick Start</h2>

          <div class="bg-black text-green-400 p-4 md:p-6 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
            <pre>{`<!-- 1. Include the library -->
<script src="corrupt.min.js"></script>

<!-- 2. Add the class -->
<h1 class="corrupt">HOVER ME</h1>

<!-- 3. That's it! -->

<!-- Advanced: Use different styles -->
<span class="corrupt" data-corrupt-style="sparkle">
  ✨ MAGICAL ✨
</span>

<!-- Advanced: Programmatic control -->
<script>
  new Corrupt('.my-text', {
    style: 'matrix',
    flicker: true,
    sticky: true
  });
</script>`}</pre>
          </div>
        </section>

        {/* API */}
        <section class="container mx-auto px-4 py-12 max-w-4xl">
          <h2 class="text-3xl font-black mb-8 text-center">Options</h2>

          <div class="bg-white rounded-lg border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
            <table class="w-full">
              <thead>
                <tr class="border-b-2 border-black">
                  <th class="text-left py-2">Option</th>
                  <th class="text-left py-2">Type</th>
                  <th class="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['style', 'string', 'Corruption style (witchhouse, sparkle, matrix, etc.)'],
                  ['rate', 'number', 'Chance of corruption per character (0-1)'],
                  ['maxCorruptions', 'number', 'Maximum characters to corrupt'],
                  ['sticky', 'boolean', '10% chance to stay corrupted briefly'],
                  ['flicker', 'boolean', 'Rapidly alternate between states'],
                  ['wave', 'boolean', 'Wave-like corruption spread'],
                  ['delay', 'number', 'Delay before corruption (ms)'],
                ].map(([option, type, desc]) => (
                  <tr key={option} class="border-b border-gray-200">
                    <td class="py-2 font-mono text-sm">{option}</td>
                    <td class="py-2 text-gray-600 text-sm">{type}</td>
                    <td class="py-2 text-sm">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer class="container mx-auto px-4 py-12 text-center text-gray-600">
          <p class="mb-2">
            Made with <span class="corrupt" data-corrupt-style="sparkle">chaos</span> by{" "}
            <a href="https://github.com/pibulus" class="underline hover:no-underline">
              Pablo
            </a>
          </p>
          <p class="text-sm">
            Inspired by baffle.js but way cooler
          </p>
        </footer>
      </div>
    </>
  );
}
