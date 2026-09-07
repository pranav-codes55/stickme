/* StickMe sticker engine — pure canvas, no server, works on PC + mobile. */

export const STICKER_SIZE = 512;

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function colorDist(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Border-flood background removal. Good for selfies/memes on fairly solid backgrounds. */
export function removeBackground(imageData, tolerance = 48) {
  const { width: w, height: h, data } = imageData;
  // Sample border pixels as background reference colors
  const refs = [];
  const push = (x, y) => {
    const i = (y * w + x) * 4;
    refs.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < w; x += 4) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 4) {
    push(0, y);
    push(w - 1, y);
  }
  // Average reference
  const avg = [0, 0, 0];
  refs.forEach((c) => {
    avg[0] += c[0];
    avg[1] += c[1];
    avg[2] += c[2];
  });
  avg[0] /= refs.length;
  avg[1] /= refs.length;
  avg[2] /= refs.length;

  const visited = new Uint8Array(w * h);
  const stack = [];
  // Seed from all border pixels close to avg
  const seed = (x, y) => {
    const i = (y * w + x) * 4;
    const c = [data[i], data[i + 1], data[i + 2]];
    if (colorDist(c, avg) < tolerance * 1.4) stack.push(y * w + x);
  };
  for (let x = 0; x < w; x++) {
    seed(x, 0);
    seed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    seed(0, y);
    seed(w - 1, y);
  }

  const idx = (x, y) => y * w + x;
  while (stack.length) {
    const p = stack.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    const x = p % w;
    const y = (p / w) | 0;
    const i = p * 4;
    const c = [data[i], data[i + 1], data[i + 2]];
    if (colorDist(c, avg) > tolerance) continue;
    data[i + 3] = 0; // transparent
    if (x > 0) stack.push(idx(x - 1, y));
    if (x < w - 1) stack.push(idx(x + 1, y));
    if (y > 0) stack.push(idx(x, y - 1));
    if (y < h - 1) stack.push(idx(x, y + 1));
  }
  return imageData;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFitted(ctx, img, S, fit, flipH, rotation) {
  ctx.save();
  ctx.translate(S / 2, S / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);
  if (flipH) ctx.scale(-1, 1);
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  let dw, dh;
  if (fit === "cover") {
    const s = Math.max(S / iw, S / ih);
    dw = iw * s;
    dh = ih * s;
  } else {
    const s = Math.min(S / iw, S / ih);
    dw = iw * s;
    dh = ih * s;
  }
  ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

function drawMemeText(ctx, S, top, bottom, fontScale, color) {
  if (!top && !bottom) return;
  const size = Math.round(S * 0.11 * fontScale);
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = color || "#fff";
  ctx.font = `900 ${size}px Inter, Arial, sans-serif`;
  ctx.lineWidth = Math.max(3, size / 7);
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.lineJoin = "round";
  const draw = (text, y) => {
    const upper = text.toUpperCase().slice(0, 42);
    ctx.strokeText(upper, S / 2, y);
    ctx.fillText(upper, S / 2, y);
  };
  if (top) draw(top, size + S * 0.03);
  if (bottom) draw(bottom, S - S * 0.045);
  ctx.restore();
}

/**
 * Render sticker to a canvas.
 * opts: { size, fit, shape, outline, outlineColor, bgRemove, bgTolerance, top, bottom, fontScale, textColor, flipH, rotation }
 */
export async function renderSticker(img, opts = {}) {
  const S = opts.size || STICKER_SIZE;
  const {
    fit = "cover",
    shape = "auto",
    outline = 14,
    outlineColor = "#ffffff",
    bgRemove = false,
    bgTolerance = 48,
    top = "",
    bottom = "",
    fontScale = 1,
    textColor = "#ffffff",
    flipH = false,
    rotation = 0,
  } = opts;

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.clearRect(0, 0, S, S);

  // 1. draw image to working layer
  const layer = document.createElement("canvas");
  layer.width = S;
  layer.height = S;
  const lctx = layer.getContext("2d", { alpha: true });

  if (shape === "circle" || shape === "rounded") {
    lctx.save();
    if (shape === "circle") {
      lctx.beginPath();
      lctx.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
      lctx.clip();
    } else {
      roundRectPath(lctx, 2, 2, S - 4, S - 4, S * 0.18);
      lctx.clip();
    }
    drawFitted(lctx, img, S, fit, flipH, rotation);
    lctx.restore();
  } else {
    drawFitted(lctx, img, S, fit, flipH, rotation);
  }

  // 2. background removal on layer
  if (bgRemove) {
    try {
      const id = lctx.getImageData(0, 0, S, S);
      removeBackground(id, bgTolerance);
      lctx.putImageData(id, 0, 0);
    } catch {
      /* tainted canvas (remote URL) — skip removal */
    }
  }

  // 3. white halo outline via silhouette offsets
  if (outline > 0) {
    const mask = document.createElement("canvas");
    mask.width = S;
    mask.height = S;
    const mctx = mask.getContext("2d");
    mctx.drawImage(layer, 0, 0);
    mctx.globalCompositeOperation = "source-in";
    mctx.fillStyle = outlineColor;
    mctx.fillRect(0, 0, S, S);
    ctx.save();
    const steps = 14;
    for (let k = 0; k < steps; k++) {
      const a = (k / steps) * Math.PI * 2;
      ctx.drawImage(mask, Math.cos(a) * outline, Math.sin(a) * outline);
    }
    ctx.restore();
  }

  ctx.drawImage(layer, 0, 0);
  drawMemeText(ctx, S, top, bottom, fontScale, textColor);
  return canvas;
}

export function canvasToBlob(canvas, type = "image/webp", quality = 0.85) {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

/** Fraction of pixels that are (near-)transparent. >0.02 ≈ real cutout. */
export function transparencyRatio(canvas, sampleStep = 8) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const { width: w, height: h } = canvas;
  let clear = 0;
  let total = 0;
  try {
    const d = ctx.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y += sampleStep) {
      for (let x = 0; x < w; x += sampleStep) {
        total++;
        if (d[(y * w + x) * 4 + 3] < 128) clear++;
      }
    }
  } catch {
    return 0;
  }
  return total ? clear / total : 0;
}

const WA_MAX_KB = 100;

/**
 * Export a genuine WhatsApp-ready sticker:
 * exactly 512x512 WebP, auto-compressed to <=100KB.
 * Returns { blob, sizeKB, quality, transparent }.
 */
export async function exportWhatsAppSticker(img, opts = {}) {
  const canvas = await renderSticker(img, { ...opts, size: STICKER_SIZE });
  const transparent = transparencyRatio(canvas) > 0.02;
  let quality = 0.88;
  let blob = await canvasToBlob(canvas, "image/webp", quality);
  while (blob && blob.size / 1024 > WA_MAX_KB && quality > 0.3) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, "image/webp", quality);
  }
  return {
    blob,
    canvas,
    sizeKB: blob ? blob.size / 1024 : 0,
    quality,
    transparent,
    withinLimit: blob ? blob.size / 1024 <= WA_MAX_KB : false,
  };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function shareFiles(files, title = "My StickMe sticker") {
  if (navigator.canShare && navigator.canShare({ files })) {
    await navigator.share({ files, title });
    return "shared";
  }
  return "unsupported";
}

const PACK_KEY = "stickme-pack-v1";

export function loadPack() {
  try {
    return JSON.parse(localStorage.getItem(PACK_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePack(pack) {
  try {
    localStorage.setItem(PACK_KEY, JSON.stringify(pack.slice(0, 24)));
  } catch {
    /* storage full — ignore */
  }
}
