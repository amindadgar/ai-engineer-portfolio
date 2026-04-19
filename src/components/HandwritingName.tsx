import { useEffect, useMemo, useRef, useState } from "react";
import dancingScriptBundle from "@/assets/fonts/dancing-script/bundle.ts";

type RawPoint = [number, number, number];
type RawStroke = { p: RawPoint[]; d: number; a: number };
type RawGlyph = { w: number; t: number; s: RawStroke[] };

type DrawPoint = { x: number; y: number; pressure: number };
type DrawStroke = {
  points: DrawPoint[];
  start: number;
  duration: number;
  tone: "line1" | "line2";
};

const FALLBACK_GLYPH_WIDTH = 320;
const LETTER_SPACING = 20;
const LINE_GAP = 120;
const TIME_SCALE = 0.48;
const GLYPH_OVERLAP = 0.8;

const COLOR_LINE_1 = "hsl(210 20% 92%)";
const COLOR_LINE_2_START = "hsl(175 80% 50%)";
const COLOR_LINE_2_END = "hsl(195 90% 55%)";
const MIN_STROKE_WIDTH = 28;
const STROKE_WIDTH_SCALE = 0.24;

const partialByLength = (points: DrawPoint[], progress: number) => {
  if (points.length <= 1 || progress >= 1) return points;
  if (progress <= 0) return [points[0]];

  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }

  const target = total * progress;
  let traversed = 0;
  const out: DrawPoint[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const segment = Math.hypot(current.x - prev.x, current.y - prev.y);

    if (traversed + segment >= target) {
      const remain = target - traversed;
      const ratio = segment === 0 ? 0 : remain / segment;
      out.push({
        x: prev.x + (current.x - prev.x) * ratio,
        y: prev.y + (current.y - prev.y) * ratio,
        pressure: prev.pressure + (current.pressure - prev.pressure) * ratio,
      });
      break;
    }

    out.push(current);
    traversed += segment;
  }

  return out;
};

const drawPath = (
  ctx: CanvasRenderingContext2D,
  points: DrawPoint[],
  color: string | CanvasGradient,
  lineWidth: number,
) => {
  if (points.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
};

const HandwritingName = () => {
  const lines = useMemo(() => ["Mohammad Amin", "Dadgar"], []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const glyphData = dancingScriptBundle.glyphData as Record<string, RawGlyph>;

  const glyphBounds = useMemo(() => {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const glyph of Object.values(glyphData)) {
      for (const stroke of glyph.s) {
        for (const point of stroke.p) {
          if (point[1] < minY) minY = point[1];
          if (point[1] > maxY) maxY = point[1];
        }
      }
    }
    return { minY, maxY };
  }, [glyphData]);

  const scene = useMemo(() => {
    const lineWidths = lines.map((line) =>
      Array.from(line).reduce((sum, char, idx) => {
        const glyph = glyphData[char];
        const width = glyph?.w ?? FALLBACK_GLYPH_WIDTH;
        const spacing = idx === line.length - 1 ? 0 : LETTER_SPACING;
        return sum + width + spacing;
      }, 0),
    );

    const maxLineWidth = Math.max(...lineWidths, 1);
    const lineHeight = glyphBounds.maxY - glyphBounds.minY + LINE_GAP;
    const totalHeightUnits = lineHeight * lines.length;
    const strokes: DrawStroke[] = [];

    let cursorTime = 0;
    let fullDuration = 0;

    lines.forEach((line, lineIndex) => {
      const tone = lineIndex === 0 ? "line1" : "line2";
      const xStart = (maxLineWidth - lineWidths[lineIndex]) / 2;
      const yStart = lineIndex * lineHeight;
      let xCursor = xStart;

      for (const char of Array.from(line)) {
        const glyph = glyphData[char];
        if (!glyph) {
          cursorTime += 0.06;
          xCursor += FALLBACK_GLYPH_WIDTH + LETTER_SPACING;
          continue;
        }

        for (const stroke of glyph.s) {
          const transformed = stroke.p.map(([x, y, pressure]) => ({
            x: xCursor + x,
            // Keep Tegaki Y orientation intact and normalize with global glyph bounds.
            y: yStart + (y - glyphBounds.minY),
            pressure,
          }));

          const duration = Math.max(0.04, stroke.a * TIME_SCALE);
          const start = cursorTime + stroke.d * TIME_SCALE;
          fullDuration = Math.max(fullDuration, start + duration);

          strokes.push({
            points: transformed,
            start,
            duration,
            tone,
          });
        }

        cursorTime += glyph.t * TIME_SCALE * GLYPH_OVERLAP;
        xCursor += glyph.w + LETTER_SPACING;
      }
    });

    return {
      strokes,
      maxLineWidth,
      totalHeightUnits,
      duration: fullDuration,
    };
  }, [glyphBounds.maxY, glyphBounds.minY, glyphData, lines]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const horizontalPadding = 24;
    const width = Math.max(280, containerWidth - horizontalPadding * 2);
    const scale = width / scene.maxLineWidth;
    const height = scene.totalHeightUnits * scale;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.scale(scale, scale);
    ctx.lineCap = dancingScriptBundle.lineCap;
    ctx.lineJoin = "round";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 0 : scene.duration;
    const startAt = performance.now();

    const frame = (now: number) => {
      const elapsed = duration === 0 ? scene.duration : Math.min(scene.duration, (now - startAt) / 1000);

      ctx.clearRect(0, 0, width / scale, height / scale);

      const gradient = ctx.createLinearGradient(0, 0, scene.maxLineWidth, 0);
      gradient.addColorStop(0, COLOR_LINE_2_START);
      gradient.addColorStop(1, COLOR_LINE_2_END);

      for (const stroke of scene.strokes) {
        if (elapsed < stroke.start) continue;
        const progress = Math.min(1, (elapsed - stroke.start) / stroke.duration);
        const partial = partialByLength(stroke.points, progress);
        const avgPressure = partial.reduce((sum, point) => sum + point.pressure, 0) / Math.max(partial.length, 1);
        const lineWidth = Math.max(MIN_STROKE_WIDTH, avgPressure * STROKE_WIDTH_SCALE);
        drawPath(ctx, partial, stroke.tone === "line1" ? COLOR_LINE_1 : gradient, lineWidth);
      }

      if (elapsed < scene.duration) {
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    rafRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerWidth, scene]);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-4xl flex justify-center">
      <canvas ref={canvasRef} aria-label="Animated handwritten name: Mohammad Amin Dadgar" />
    </div>
  );
};

export default HandwritingName;
