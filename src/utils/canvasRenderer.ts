import { CanvasElement } from '../types';
import { getShapeDefinition } from './shapeDefinitions';

/**
 * Applies solid color or linear gradient to canvas background
 */
function applyBackgroundToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: string
) {
  if (bg && (bg.includes('gradient') || bg.includes('linear-gradient'))) {
    let x0 = 0;
    let y0 = 0;
    let x1 = width;
    let y1 = height;

    if (bg.includes('to right')) {
      x0 = 0;
      y0 = 0;
      x1 = width;
      y1 = 0;
    } else if (bg.includes('to bottom')) {
      x0 = 0;
      y0 = 0;
      x1 = 0;
      y1 = height;
    } else if (bg.includes('to top')) {
      x0 = 0;
      y0 = height;
      x1 = 0;
      y1 = 0;
    } else if (bg.includes('45deg')) {
      x0 = 0;
      y0 = height;
      x1 = width;
      y1 = 0;
    } else if (bg.includes('135deg')) {
      x0 = 0;
      y0 = 0;
      x1 = width;
      y1 = height;
    }

    const hexColors = bg.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgba?\([^)]+\)/g);
    if (hexColors && hexColors.length >= 2) {
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      hexColors.forEach((color, idx) => {
        const stop = idx / (hexColors.length - 1);
        try {
          grad.addColorStop(stop, color);
        } catch {
          // ignore invalid stop
        }
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      return;
    }
  }

  ctx.fillStyle = bg || '#ffffff';
  ctx.fillRect(0, 0, width, height);
}

/**
 * Splits text into wrapped lines matching DOM width measurement
 */
function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = (text || '').split('\n');
  const result: string[] = [];

  for (const para of paragraphs) {
    if (!para) {
      result.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          result.push(currentLine);
          currentLine = '';
        }

        // If a single word exceeds maxWidth, break it character by character
        if (ctx.measureText(word).width > maxWidth) {
          let charChunk = '';
          for (let c = 0; c < word.length; c++) {
            const char = word[c];
            if (ctx.measureText(charChunk + char).width <= maxWidth) {
              charChunk += char;
            } else {
              if (charChunk) result.push(charChunk);
              charChunk = char;
            }
          }
          currentLine = charChunk;
        } else {
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result.length > 0 ? result : [''];
}

/**
 * High-resolution canvas renderer to export designs faithfully to PNG or JPEG
 */
export async function renderDesignToCanvas(
  width: number,
  height: number,
  backgroundColor: string,
  elements: CanvasElement[]
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D de canvas');
  }

  // Draw background
  applyBackgroundToCanvas(ctx, width, height, backgroundColor);

  // Sort elements by zIndex
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Pre-load any images
  const imageElements = sortedElements.filter((el) => el.type === 'image' && el.src);
  const loadedImages = new Map<string, HTMLImageElement>();

  await Promise.all(
    imageElements.map((el) => {
      return new Promise<void>((resolve) => {
        if (!el.src) return resolve();
        if (loadedImages.has(el.src)) return resolve();

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          loadedImages.set(el.src!, img);
          resolve();
        };
        img.onerror = () => {
          resolve(); // gracefully continue
        };
        img.src = el.src;
      });
    })
  );

  // Draw each element
  for (const el of sortedElements) {
    ctx.save();

    // Calculate center for rotation
    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;

    ctx.translate(centerX, centerY);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;

    // Apply shadow if enabled
    if (el.shadowEnabled) {
      ctx.shadowColor = el.shadowColor || 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = el.shadowBlur || 14;
      ctx.shadowOffsetX = el.shadowOffsetX || 0;
      ctx.shadowOffsetY = el.shadowOffsetY || 6;
    }

    // Relative coordinates (-width/2, -height/2)
    const rx = -el.width / 2;
    const ry = -el.height / 2;

    if (el.type === 'shape') {
      const shapeDef = getShapeDefinition(el.shapeType || 'rectangle');
      const fillColor = el.fillColor || '#7c3aed';
      const borderColor = el.borderColor || 'transparent';
      const borderWidth = el.borderWidth || 0;

      ctx.save();
      ctx.translate(rx, ry);
      const scaleX = el.width / 100;
      const scaleY = el.height / 100;
      ctx.scale(scaleX, scaleY);

      const path2d = new Path2D(shapeDef.path);
      if (fillColor !== 'transparent') {
        ctx.fillStyle = fillColor;
        ctx.fill(path2d);
      }

      if (borderWidth > 0 && borderColor !== 'transparent') {
        ctx.strokeStyle = borderColor;
        // Adjust line width back to unscaled canvas pixels
        const avgScale = (scaleX + scaleY) / 2 || 1;
        ctx.lineWidth = borderWidth / avgScale;
        ctx.lineJoin = 'round';
        ctx.stroke(path2d);
      }
      ctx.restore();
    } else if (el.type === 'text') {
      const fontSize = el.fontSize || 32;
      const fontFamily = el.fontFamily || 'Plus Jakarta Sans';
      const fontWeight = el.fontWeight || 'normal';
      const fontStyle = el.fontStyle || 'normal';
      const color = el.color || '#000000';
      const align = el.textAlign || 'left';
      const lineHeight = (el.lineHeight || 1.2) * fontSize;

      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", system-ui, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      // Use max width matching DOM container padding (p-1 is 4px on each side)
      const maxWidth = Math.max(10, el.width - 8);
      const lines = wrapTextLines(ctx, el.text || '', maxWidth);
      const totalTextHeight = lines.length * lineHeight;
      const startY = ry + (el.height - totalTextHeight) / 2 + lineHeight / 2;

      let drawX = rx + 4;
      if (align === 'center') {
        drawX = 0;
      } else if (align === 'right') {
        drawX = rx + el.width - 4;
      }

      lines.forEach((line, index) => {
        const curY = startY + index * lineHeight;
        ctx.fillText(line, drawX, curY);
      });
    } else if (el.type === 'image') {
      const img = el.src ? loadedImages.get(el.src) : null;
      if (img) {
        if (el.borderRadius && el.borderRadius > 0) {
          ctx.beginPath();
          const r = Math.min(el.borderRadius, el.width / 2, el.height / 2);
          ctx.moveTo(rx + r, ry);
          ctx.lineTo(rx + el.width - r, ry);
          ctx.quadraticCurveTo(rx + el.width, ry, rx + el.width, ry + r);
          ctx.lineTo(rx + el.width, ry + el.height - r);
          ctx.quadraticCurveTo(rx + el.width, ry + el.height, rx + el.width - r, ry + el.height);
          ctx.lineTo(rx + r, ry + el.height);
          ctx.quadraticCurveTo(rx, ry + el.height, rx, ry + el.height - r);
          ctx.lineTo(rx, ry + r);
          ctx.quadraticCurveTo(rx, ry, rx + r, ry);
          ctx.closePath();
          ctx.clip();
        }
        ctx.drawImage(img, rx, ry, el.width, el.height);
      }
    }

    ctx.restore();
  }

  return canvas;
}

/**
 * Downloads a canvas rendering as an image file
 */
export async function downloadDesign(
  width: number,
  height: number,
  backgroundColor: string,
  elements: CanvasElement[],
  fileName: string = 'mi-diseño-pixora',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const canvas = await renderDesignToCanvas(width, height, backgroundColor, elements);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.download = `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}.${extension}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
