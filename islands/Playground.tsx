import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export default function Playground() {
  const text = useSignal("HOVER TO CORRUPT");
  const style = useSignal("witch");
  const corruption = useSignal(50);  // Amount of corruption (0-100)
  const speed = useSignal(50);  // Speed of animation (0-100)
  const duration = useSignal(50);  // How long effect lasts (0-100)
  const textRef = useRef<HTMLHeadingElement>(null);
  const corruptInstance = useRef<any>(null);

  const styles = [
    { value: 'witch', label: 'Witch', icon: '†' },
    { value: 'matrix', label: 'Matrix', icon: '01' },
    { value: 'sparkle', label: 'Sparkle', icon: '✨' },
    { value: 'dots', label: 'Dots', icon: '•••' },
    { value: 'melt', label: 'Melt', icon: '▼' },
    { value: 'wave', label: 'Wave', icon: '~' },
  ];

  // Apply corruption when settings change
  useEffect(() => {
    if (textRef.current && typeof window !== 'undefined') {
      // Clean up previous instance
      if (corruptInstance.current) {
        // Remove old event listeners by replacing element
        const newElement = textRef.current.cloneNode(true) as HTMLHeadingElement;
        textRef.current.parentNode?.replaceChild(newElement, textRef.current);
        textRef.current = newElement;
      }

      // Create new Corrupt instance with current settings
      // @ts-ignore
      if (window.Corrupt) {
        // Convert corruption (0-100) to rate (0.05-0.5) and maxCorruptions (1-8)
        const rate = 0.05 + (corruption.value / 100) * 0.45;  // 0% = 0.05, 100% = 0.5
        const maxCorruptions = Math.max(1, Math.round((corruption.value / 100) * 8));  // 0% = 1, 100% = 8

        // Convert speed (0-100) to animation duration (3000-200ms)
        const animDuration = 3000 - (speed.value / 100) * 2800;  // 0% = 3000ms (slow), 100% = 200ms (fast)

        // Convert duration (0-100) to hover duration multiplier
        // This affects how long the effect persists (not implemented in base library, but we can hack it)
        const persist = duration.value / 100;  // Will use this for continuous effect

        // @ts-ignore
        corruptInstance.current = new window.Corrupt(textRef.current, {
          style: style.value,
          rate: rate,
          maxCorruptions: maxCorruptions,
          duration: animDuration,
          continuous: true  // This will keep it animating
        });
      }
    }
  }, [style.value, corruption.value, speed.value, duration.value]);

  return (
    <div class="max-w-2xl mx-auto">
      {/* Display Area - No title, just the interactive text */}
      <div class="bg-yellow-100 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <h1
          ref={textRef}
          class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-center cursor-pointer select-none break-words transition-all hover:scale-105"
          style="font-family: 'Space Mono', 'Courier New', monospace;"
        >
          {text.value}
        </h1>
      </div>

      {/* Controls Panel */}
      <div class="bg-pink-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        {/* Text Input */}
        <div>
          <label class="block text-sm font-black uppercase mb-2">Text</label>
          <input
            type="text"
            value={text.value}
            onInput={(e) => text.value = e.currentTarget.value}
            class="w-full px-4 py-3 border-3 border-black bg-white text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            placeholder="Type something fun..."
            style="font-family: 'Space Mono', monospace;"
          />
        </div>

        {/* Style Dropdown */}
        <div>
          <label class="block text-sm font-black uppercase mb-2">Style</label>
          <div class="relative">
            <select
              value={style.value}
              onChange={(e) => style.value = e.currentTarget.value}
              class="w-full appearance-none px-4 py-3 pr-10 border-3 border-black bg-white text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              style="font-family: 'Space Mono', monospace;"
            >
              {styles.map(({ value, label, icon }) => (
                <option key={value} value={value}>
                  {icon} {label}
                </option>
              ))}
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Neo-brutalist Sliders */}
        <div class="space-y-4">
          {/* Corruption Amount Slider */}
          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm font-black uppercase">Corruption</label>
              <span class="text-sm font-black bg-black text-white px-2 py-1">{corruption.value}%</span>
            </div>
            <div class="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={corruption.value}
                onInput={(e) => corruption.value = parseInt(e.currentTarget.value)}
                class="w-full h-4 bg-white border-3 border-black appearance-none cursor-pointer slider rounded-none"
                style={`
                  background: linear-gradient(to right,
                    #ff00ff 0%,
                    #ff00ff ${corruption.value}%,
                    white ${corruption.value}%,
                    white 100%);
                `}
              />
              <div class="flex justify-between text-xs font-bold mt-1">
                <span>CLEAN</span>
                <span>CHAOS</span>
              </div>
            </div>
          </div>

          {/* Speed Slider */}
          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm font-black uppercase">Speed</label>
              <span class="text-sm font-black bg-black text-white px-2 py-1">{speed.value}%</span>
            </div>
            <div class="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={speed.value}
                onInput={(e) => speed.value = parseInt(e.currentTarget.value)}
                class="w-full h-4 bg-white border-3 border-black appearance-none cursor-pointer slider rounded-none"
                style={`
                  background: linear-gradient(to right,
                    #00ff00 0%,
                    #00ff00 ${speed.value}%,
                    white ${speed.value}%,
                    white 100%);
                `}
              />
              <div class="flex justify-between text-xs font-bold mt-1">
                <span>SLOW</span>
                <span>HYPER</span>
              </div>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm font-black uppercase">Duration</label>
              <span class="text-sm font-black bg-black text-white px-2 py-1">
                {duration.value === 0 ? 'QUICK' : duration.value === 100 ? 'FOREVER' : `${duration.value}%`}
              </span>
            </div>
            <div class="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={duration.value}
                onInput={(e) => duration.value = parseInt(e.currentTarget.value)}
                class="w-full h-4 bg-white border-3 border-black appearance-none cursor-pointer slider rounded-none"
                style={`
                  background: linear-gradient(to right,
                    #00ffff 0%,
                    #00ffff ${duration.value}%,
                    white ${duration.value}%,
                    white 100%);
                `}
              />
              <div class="flex justify-between text-xs font-bold mt-1">
                <span>QUICK</span>
                <span>FOREVER</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Output */}
      <div class="mt-8 bg-black border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <label class="block text-sm font-black uppercase mb-3 text-green-400">CODE</label>
        <div class="text-green-400 font-mono text-xs overflow-x-auto">
          <pre style="font-family: 'Space Mono', 'Courier New', monospace;">{`<span
  class="corrupt"
  data-corrupt-style="${style.value}"
  data-corrupt-rate="${(0.05 + (corruption.value / 100) * 0.45).toFixed(2)}"
  data-corrupt-chars="${Math.max(1, Math.round((corruption.value / 100) * 8))}"
>
  ${text.value}
</span>

<!-- Or programmatically -->
<script>
new Corrupt('.my-text', {
  style: '${style.value}',
  rate: ${(0.05 + (corruption.value / 100) * 0.45).toFixed(2)},
  maxCorruptions: ${Math.max(1, Math.round((corruption.value / 100) * 8))},
  duration: ${3000 - (speed.value / 100) * 2800}
});
</script>`}</pre>
        </div>
      </div>
    </div>
  );
}