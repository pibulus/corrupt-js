import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* SEO Meta Tags */}
        <meta name="description" content="Interactive text corruption library for hover effects. Zero dependencies, 3.9kb. Add glitch, matrix, sparkle effects to any text with just a CSS class." />
        <meta name="keywords" content="text corruption, glitch effect, hover animation, javascript library, text effects, typography, interactive text" />
        <meta name="author" content="Pablo Alvarado" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://corrupt-js.deno.dev" />
        <meta property="og:title" content="corrupt.js - Interactive Text Corruption Library" />
        <meta property="og:description" content="Add interactive glitch effects to text on hover. Zero dependencies, 3.9kb." />
        <meta property="og:image" content="https://corrupt-js.deno.dev/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://corrupt-js.deno.dev" />
        <meta property="twitter:title" content="corrupt.js - Interactive Text Corruption" />
        <meta property="twitter:description" content="Add interactive glitch effects to text on hover. Zero dependencies, 3.9kb." />
        <meta property="twitter:image" content="https://corrupt-js.deno.dev/og-image.png" />

        <link rel="stylesheet" href="/styles.css" />

        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
