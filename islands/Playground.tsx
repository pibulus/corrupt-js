import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export default function Playground() {
  const text = useSignal("TYPE YOUR TEXT HERE");
  const style = useSignal("glitch");
  const rate = useSignal(0.3);
  const maxCorruptions = useSignal(2);
  const flicker = useSignal(false);
  const wave = useSignal(false);
  const sticky = useSignal(false);
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
        // @ts-ignore
        corruptInstance.current = new window.Corrupt(textRef.current, {
          style: style.value,
          rate: rate.value,
          maxCorruptions: maxCorruptions.value,
          flicker: flicker.value,
          wave: wave.value,
          sticky: sticky.value
        });
      }
    }
  }, [style.value, rate.value, maxCorruptions.value, flicker.value, wave.value, sticky.value]);

  return (
    <div class="bg-white rounded-lg border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
      {/* Display Text */}
      <div class="mb-8 p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border-2 border-gray-200">
        <h1
          ref={textRef}
          class="text-4xl md:text-6xl font-black text-center cursor-pointer select-none"
        >
          {text.value}
        </h1>
      </div>

      {/* Controls Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Input */}
        <div>
          <label class="block text-sm font-bold mb-2">Text Content</label>
          <input
            type="text"
            value={text.value}
            onInput={(e) => text.value = e.currentTarget.value}
            class="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your text..."
          />
        </div>

        {/* Style Selector */}
        <div>
          <label class="block text-sm font-bold mb-2">Corruption Style</label>
          <select
            value={style.value}
            onChange={(e) => style.value = e.currentTarget.value}
            class="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="witchhouse">Witchhouse</option>
            <option value="sparkle">Sparkle</option>
            <option value="matrix">Matrix</option>
            <option value="glitch">Glitch</option>
            <option value="zalgo">Zalgo</option>
            <option value="melt">Melt</option>
            <option value="ascii">ASCII</option>
          </select>
        </div>

        {/* Corruption Rate */}
        <div>
          <label class="block text-sm font-bold mb-2">
            Corruption Rate: {(rate.value * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={rate.value}
            onInput={(e) => rate.value = parseFloat(e.currentTarget.value)}
            class="w-full"
          />
        </div>

        {/* Max Corruptions */}
        <div>
          <label class="block text-sm font-bold mb-2">
            Max Characters: {maxCorruptions.value}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={maxCorruptions.value}
            onInput={(e) => maxCorruptions.value = parseInt(e.currentTarget.value)}
            class="w-full"
          />
        </div>

        {/* Effect Toggles */}
        <div class="md:col-span-2">
          <label class="block text-sm font-bold mb-2">Effects</label>
          <div class="flex gap-4 flex-wrap">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flicker.value}
                onChange={(e) => flicker.value = e.currentTarget.checked}
                class="w-4 h-4"
              />
              <span>Flicker</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wave.value}
                onChange={(e) => wave.value = e.currentTarget.checked}
                class="w-4 h-4"
              />
              <span>Wave</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sticky.value}
                onChange={(e) => sticky.value = e.currentTarget.checked}
                class="w-4 h-4"
              />
              <span>Sticky</span>
            </label>
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
  data-corrupt-rate="${rate.value}"
  data-corrupt-chars="${maxCorruptions.value}"
>
  ${text.value}
</span>

<!-- Or programmatically -->
<script>
new Corrupt('.my-text', {
  style: '${style.value}',
  rate: ${rate.value},
  maxCorruptions: ${maxCorruptions.value}${flicker.value ? ',\n  flicker: true' : ''}${wave.value ? ',\n  wave: true' : ''}${sticky.value ? ',\n  sticky: true' : ''}
});
</script>`}</pre>
        </div>
      </div>
    </div>
  );
}