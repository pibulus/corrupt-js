import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - corrupt.js</title>
        <script src="/corrupt.js"></script>
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div class="text-center p-8">
          <h1 class="text-6xl font-black mb-4 corrupt" data-corrupt-style="glitch">
            404
          </h1>
          <p class="text-xl mb-8 corrupt" data-corrupt-style="melt">
            Page not found
          </p>
          <a
            href="/"
            class="px-8 py-3 bg-black text-white font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all corrupt"
            data-corrupt-style="witchhouse"
          >
            Go Home
          </a>
        </div>
      </div>
    </>
  );
}
