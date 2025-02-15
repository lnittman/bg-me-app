import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const SIZES = [16, 32, 192, 512];
const BRIEFCASE = '1f4bc'; // Unicode for 💼
const PUBLIC_DIR = 'public';
const ICONS_DIR = 'icons';

// Different padding ratios for different contexts
const PADDING_RATIOS = {
  favicon: 0.1,    // 10% padding for favicon (browser)
  appIcon: 0.3,    // 30% padding for app icon (home screen)
};

async function downloadEmoji(codePoint) {
  const url = `https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/${codePoint}.svg`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function generateIcon(size, padding = PADDING_RATIOS.favicon, isDark = false) {
  const svgBuffer = await downloadEmoji(BRIEFCASE);
  
  // Calculate padding
  const paddingSize = Math.round(size * padding);
  const imageSize = size - (paddingSize * 2);

  return sharp(svgBuffer)
    .resize(imageSize, imageSize)
    .extend({
      top: paddingSize,
      bottom: paddingSize,
      left: paddingSize,
      right: paddingSize,
      background: isDark ? { r: 9, g: 9, b: 11, alpha: 1 } : { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png();
}

async function saveIcon(sharpInstance, filename) {
  const filepath = path.join(process.cwd(), PUBLIC_DIR, ICONS_DIR, filename);
  
  // Ensure directory exists
  await fs.mkdir(path.join(process.cwd(), PUBLIC_DIR, ICONS_DIR), { recursive: true });
  
  await sharpInstance.toFile(filepath);
  console.log(`Generated ${filename}`);
}

async function main() {
  // Generate favicons (less padding)
  for (const size of [16, 32]) {
    const icon = await generateIcon(size, PADDING_RATIOS.favicon);
    await saveIcon(icon, `favicon-${size}.png`);
  }

  // Generate app icons (more padding) for both light and dark modes
  for (const size of [192, 512]) {
    // Light mode
    const lightIcon = await generateIcon(size, PADDING_RATIOS.appIcon, false);
    await saveIcon(lightIcon, `icon-${size}.png`);
    
    // Dark mode
    const darkIcon = await generateIcon(size, PADDING_RATIOS.appIcon, true);
    await saveIcon(darkIcon, `icon-${size}-dark.png`);
  }
}

main().catch(console.error); 