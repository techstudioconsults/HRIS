/**
 * Generates iOS splash screen PNGs from the app logo.
 * Usage: node scripts/generate-splash-screens.mjs
 *
 * Requires: sharp (already in devDependencies)
 *
 * iOS requires exact physical-pixel-dimension PNGs for each device.
 * A 512×512 image scaled by the browser matches no device → blank screen.
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const SPLASH_DIR = resolve(PUBLIC_DIR, 'splash');
const LOGO_PATH = resolve(PUBLIC_DIR, 'images', 'logo.png');
const BRAND_COLOR = '#0f172a';

const DEVICES = [
  // ── iPhone SE, 6, 7, 8 ──────────────────────────────────────────
  {
    width: 750,
    height: 1334,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 1334,
    height: 750,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPhone 8+, 7+, 6+ ───────────────────────────────────────────
  {
    width: 1242,
    height: 2208,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2208,
    height: 1242,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone X, XS, 11 Pro ────────────────────────────────────────
  {
    width: 1125,
    height: 2436,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2436,
    height: 1125,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone XR, 11 ───────────────────────────────────────────────
  {
    width: 828,
    height: 1792,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 1792,
    height: 828,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPhone XS Max, 11 Pro Max ───────────────────────────────────
  {
    width: 1242,
    height: 2688,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2688,
    height: 1242,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone 12, 13, 14 ───────────────────────────────────────────
  {
    width: 1170,
    height: 2532,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2532,
    height: 1170,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone 12/13/14 Pro Max ─────────────────────────────────────
  {
    width: 1284,
    height: 2778,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2778,
    height: 1284,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone 14 Pro, 15, 16 ───────────────────────────────────────
  {
    width: 1179,
    height: 2556,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2556,
    height: 1179,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPhone 15/16 Pro Max ────────────────────────────────────────
  {
    width: 1290,
    height: 2796,
    scale: 3,
    orientation: 'portrait',
    media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
  },
  {
    width: 2796,
    height: 1290,
    scale: 3,
    orientation: 'landscape',
    media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
  },
  // ── iPad Mini ───────────────────────────────────────────────────
  {
    width: 1536,
    height: 2048,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 2048,
    height: 1536,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPad 10.2" / Air ────────────────────────────────────────────
  {
    width: 1620,
    height: 2160,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 2160,
    height: 1620,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPad Pro 10.5" ──────────────────────────────────────────────
  {
    width: 1668,
    height: 2224,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 2224,
    height: 1668,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPad Pro 11" ────────────────────────────────────────────────
  {
    width: 1668,
    height: 2388,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 2388,
    height: 1668,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
  },
  // ── iPad Pro 12.9" ──────────────────────────────────────────────
  {
    width: 2048,
    height: 2732,
    scale: 2,
    orientation: 'portrait',
    media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
  },
  {
    width: 2732,
    height: 2048,
    scale: 2,
    orientation: 'landscape',
    media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
  },
];

if (!existsSync(SPLASH_DIR)) {
  mkdirSync(SPLASH_DIR, { recursive: true });
}

async function generate() {
  let logoBuffer;
  try {
    logoBuffer = await sharp(LOGO_PATH).resize(256, 256, { fit: 'inside' }).toBuffer();
  } catch {
    console.warn('logo.png not found — using brand-colored placeholder');
  }

  const total = DEVICES.length;
  for (let i = 0; i < total; i++) {
    const { width, height, scale, orientation, media } = DEVICES[i];
    const filename = `splash-${width}x${height}.png`;
    const outPath = resolve(SPLASH_DIR, filename);

    // Skip if already generated
    if (existsSync(outPath)) {
      console.log(`[${i + 1}/${total}] ${filename} (exists, skipping)`);
      continue;
    }

    // Create base canvas
    let composite = sharp({
      create: { width, height, channels: 3, background: BRAND_COLOR },
    });

    // Overlay logo if available
    if (logoBuffer) {
      const logoSize = Math.round(Math.min(width, height) * 0.25);
      const resizedLogo = await sharp(logoBuffer)
        .resize(logoSize, logoSize, { fit: 'inside' })
        .toBuffer();
      composite = composite.composite([
        {
          input: resizedLogo,
          gravity: 'center',
        },
      ]);
    }

    await composite.png().toFile(outPath);
    console.log(`[${i + 1}/${total}] ${filename} (${width}×${height}, @${scale}x, ${orientation})`);
  }

  console.log(`\nDone! Generated splash images in ${SPLASH_DIR}`);

  // Emit TypeScript-ready media query definitions for layout.tsx
  console.log('\n// ─── Copy into appleWebApp.startupImage ───');
  for (const { width, height, media } of DEVICES) {
    console.log(
      `  { url: '/splash/splash-${width}x${height}.png', media: '${media}' },`
    );
  }
}

generate().catch((err) => {
  console.error('Failed to generate splash screens:', err);
  process.exit(1);
});
