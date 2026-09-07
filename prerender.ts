import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';

const require = createRequire(import.meta.url);

// 1. Mock minimal browser environment so that top-level library imports (like Framer Motion) don't crash
const mockBrowser = () => {
  const noop = () => {};
  const mockStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  
  globalThis.window = {
    scrollY: 0,
    scrollX: 0,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    localStorage: mockStorage,
    sessionStorage: mockStorage,
    matchMedia: () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => true,
    }),
    getComputedStyle: () => ({}),
  } as any;

  globalThis.document = {
    createElement: () => ({
      style: {},
      setAttribute: noop,
      appendChild: noop,
    }),
    addEventListener: noop,
    removeEventListener: noop,
    documentElement: {
      classList: {
        add: noop,
        remove: noop,
        contains: () => false,
      },
      style: {},
    },
  } as any;

  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'NodePrerender' },
    writable: true,
    configurable: true,
  });
  
  globalThis.localStorage = mockStorage as any;
  globalThis.sessionStorage = mockStorage as any;
};

async function main() {
  console.log('🚀 Starting ET Digital build-time pre-rendering process...');
  
  const tempOutFile = path.resolve('./dist/prerender-bundle.cjs');
  
  // 2. Programmatically compile App.tsx and local files, treating packages as external and discarding CSS
  await esbuild.build({
    entryPoints: [path.resolve('./src/App.tsx')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: tempOutFile,
    packages: 'external',
    loader: {
      '.css': 'empty',
      '.png': 'empty',
      '.jpg': 'empty',
      '.jpeg': 'empty',
      '.svg': 'empty',
      '.webp': 'empty',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  console.log('✅ Temporary prerender bundle compiled successfully.');

  // Initialize browser mocks
  mockBrowser();

  // 3. Dynamic import of the compiled App component
  const App = require(tempOutFile).default;

  // 4. Render App to static HTML string
  console.log('✨ Rendering App to static HTML...');
  const renderedHtml = renderToString(React.createElement(App));
  console.log(`✅ App rendered successfully (${renderedHtml.length} characters).`);

  // 5. Read dist/index.html and inject the rendered HTML
  const indexPath = path.resolve('./dist/index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html does not exist! Make sure "npm run build" runs before this pre-renderer.`);
  }

  let indexHtml = fs.readFileSync(indexPath, 'utf-8');
  
  // Replace <div id="root"></div> with our rendered HTML
  const targetPlaceholder = '<div id="root"></div>';
  if (!indexHtml.includes(targetPlaceholder)) {
    throw new Error('Could not find <div id="root"></div> in dist/index.html!');
  }

  indexHtml = indexHtml.replace(targetPlaceholder, `<div id="root">${renderedHtml}</div>`);

  // Write it back to dist/index.html
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');
  console.log('🎉 Successfully pre-rendered and wrote to dist/index.html!');

  // 6. Clean up temporary file
  if (fs.existsSync(tempOutFile)) {
    fs.unlinkSync(tempOutFile);
    console.log('🗑️ Cleaned up temporary prerender bundle.');
  }
}

main().catch(err => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
