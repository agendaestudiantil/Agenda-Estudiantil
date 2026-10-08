// Generates the PWA icon PNGs from public/logo-agenda.png using sharp.
// Run: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const source = path.join(publicDir, 'logo-agenda.png');

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const GREEN = { r: 0x14, g: 0x96, b: 0x56, alpha: 1 }; // #149656

// Draw the logo centered on a solid background canvas of the given size.
async function iconOnBackground(size, background, logoScale) {
  const logoSize = Math.round(size * logoScale);
  const logo = await sharp(source)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png();
}

async function run() {
  // Standard any-purpose icons: logo on white, minimal padding.
  await (await iconOnBackground(192, WHITE, 0.92)).toFile(path.join(publicDir, 'pwa-192x192.png'));
  await (await iconOnBackground(512, WHITE, 0.92)).toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Maskable: logo on green with safe-area padding (~70% of canvas).
  await (await iconOnBackground(512, GREEN, 0.7)).toFile(path.join(publicDir, 'maskable-512x512.png'));

  // Apple touch icon: logo on white, 180x180, no transparency.
  await (await iconOnBackground(180, WHITE, 0.92)).toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('PWA icons generated in public/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
