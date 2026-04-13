import sharp from "sharp";

const appleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#080808"/>
  <text x="24" y="110" font-family="Arial Black, system-ui, sans-serif" font-weight="900" font-size="80" fill="#F0F0F0">R2</text>
  <text x="24" y="145" font-family="Courier New, monospace" font-size="28" fill="rgba(240,240,240,0.4)">·OS</text>
</svg>`;

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" rx="80" fill="#080808"/>
  <text x="68" y="310" font-family="Arial Black, system-ui, sans-serif" font-weight="900" font-size="228" fill="#F0F0F0">R2</text>
  <text x="68" y="410" font-family="Courier New, monospace" font-size="80" fill="rgba(240,240,240,0.4)">·OS</text>
</svg>`;

await sharp(Buffer.from(appleSvg)).png().toFile("public/apple-touch-icon.png");
console.log("Created public/apple-touch-icon.png (180x180)");

await sharp(Buffer.from(iconSvg)).png().toFile("public/icon-512.png");
console.log("Created public/icon-512.png (512x512)");
