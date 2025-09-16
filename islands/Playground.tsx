import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export default function Playground() {
  const text = useSignal("HOVER TO CORRUPT");
  const style = useSignal("witch");
  const intensity = useSignal(50);  // 0-100 scale for simplicity
  const speed = useSignal(50);  // 0-100 scale for speed
  const textRef = useRef<HTMLHeadingElement>(null);
  const corruptInstance = useRef<any>(null);

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
        // Convert intensity (0-100) to rate (0-1) and maxCorruptions (1-5)
        const rate = intensity.value / 200;  // 50% = 0.25 rate
        const maxCorruptions = Math.ceil(intensity.value / 20);  // 50% = 3 chars

        // Convert speed (0-100) to duration (2000-200ms)
        const duration = 2200 - (speed.value * 20);  // 50% = 1200ms

        // @ts-ignore
        corruptInstance.current = new window.Corrupt(textRef.current, {
          style: style.value,
          rate: rate,
          maxCorruptions: maxCorruptions,
          duration: duration
        });
      }
    }
  }, [style.value, intensity.value, speed.value]);

  return (
    <div class="bg-white rounded-lg border-4 border-black p-4 sm:p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
      {/* Display Text */}
      <div class="mb-6 md:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border-2 border-gray-200">
        <h1
          ref={textRef}
          class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-center cursor-pointer select-none break-words"
        >
          {text.value}
        </h1>
      </div>

      {/* Simple Controls */}
      <div class="space-y-6">
        {/* Text Input */}
        <div>
          <label class="block text-sm font-bold mb-2">Your Text</label>
          <input
            type="text"
            value={text.value}
            onInput={(e) => text.value = e.currentTarget.value}
            class="w-full px-4 py-3 border-2 border-black rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Type something fun..."
          />
        </div>

        {/* Style Buttons */}
        <div>
          <label class="block text-sm font-bold mb-3">Choose Style</label>
          <div class="grid grid-cols-3 gap-2">
            {[
              { value: 'witch', label: '† Witch' },
              { value: 'matrix', label: '01 Matrix' },
              { value: 'sparkle', label: '✨ Sparkle' },
              { value: 'dots', label: '• Dots' },
              { value: 'melt', label: '▼ Melt' },
              { value: 'wave', label: '~ Wave' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => style.value = value}
                class={`px-4 py-2 border-2 border-black rounded font-bold transition-all ${
                  style.value === value
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <div>
          <label class="block text-sm font-bold mb-2">
            Intensity: <span class="text-pink-500">{intensity.value}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={intensity.value}
            onInput={(e) => intensity.value = parseInt(e.currentTarget.value)}
            class="w-full accent-pink-500"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>Wild</span>
          </div>
        </div>

        {/* Speed Slider */}
        <div>
          <label class="block text-sm font-bold mb-2">
            Speed: <span class="text-pink-500">{speed.value}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={speed.value}
            onInput={(e) => speed.value = parseInt(e.currentTarget.value)}
            class="w-full accent-pink-500"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      {/* Code Output */}
      <div class="mt-8">
        <label class="block text-sm font-bold mb-2">Your Code:</label>
        <div class="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
          <pre>{`<span
  class="corrupt"
  data-corrupt-style="${style.value}"
  data-corrupt-rate="${(intensity.value / 200).toFixed(2)}"
  data-corrupt-chars="${Math.ceil(intensity.value / 20)}"
>
  ${text.value}
</span>

<!-- Or programmatically -->
<script>
new Corrupt('.my-text', {
  style: '${style.value}',
  rate: ${(intensity.value / 200).toFixed(2)},
  maxCorruptions: ${Math.ceil(intensity.value / 20)},
  duration: ${2200 - (speed.value * 20)}
});
</script>`}</pre>
        </div>
      </div>
    </div>
  );
}