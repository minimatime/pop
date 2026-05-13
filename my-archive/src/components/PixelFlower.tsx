"use client";
import { useEffect, useRef } from "react";

const FLOWER_PIXELS = [
  [0, 0],
  [0, -2], [0, -3], [-1, -2], [1, -2],
  [0, 2], [0, 3], [-1, 2], [1, 2],
  [-2, 0], [-3, 0], [-2, -1], [-2, 1],
  [2, 0], [3, 0], [2, -1], [2, 1],
  [-1, -1], [1, -1], [-1, 1], [1, 1],
  [-2, -2], [2, -2], [-2, 2], [2, 2],
];

const DOT_SIZE = 6;
const SPACING = 8;
const COLORS = ["#023020", "#097969", "#AFE1AF", "#1a5c3a"];

export default function PixelFlower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    function makeOrigin() {
      return { x: Math.random() * W, y: Math.random() * H };
    }

    type Phase = "flying-in" | "holding" | "flying-out" | "waiting";

    const dots = FLOWER_PIXELS.map(([gx, gy], i) => {
      const o = makeOrigin();
      return {
        targetX: cx + gx * SPACING,
        targetY: cy + gy * SPACING,
        startX: o.x,
        startY: o.y,
        endX: 0,
        endY: 0,
        x: o.x,
        y: o.y,
        color: COLORS[i % COLORS.length],
        phase: "flying-in" as Phase,
        progress: 0,
        speed: 0.008 + Math.random() * 0.008,
        holdTimer: 0,
        holdDuration: 100 + Math.floor(Math.random() * 60),
        delay: Math.floor(Math.random() * 40),
        delayTimer: 0,
        waitTimer: 0,
        waitDuration: 40 + Math.floor(Math.random() * 60),
      };
    });

    let animId: number;

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      dots.forEach((d) => {
        if (d.phase === "flying-in") {
          if (d.delayTimer < d.delay) {
            d.delayTimer++;
            return;
          }
          d.progress = Math.min(1, d.progress + d.speed);
          const e = easeInOut(d.progress);
          d.x = d.startX + (d.targetX - d.startX) * e;
          d.y = d.startY + (d.targetY - d.startY) * e;
          if (d.progress >= 1) {
            d.x = d.targetX;
            d.y = d.targetY;
            d.phase = "holding";
            d.holdTimer = 0;
            d.holdDuration = 100 + Math.floor(Math.random() * 60);
          }
        } else if (d.phase === "holding") {
          d.holdTimer++;
          if (d.holdTimer >= d.holdDuration) {
            const o = makeOrigin();
            d.endX = o.x;
            d.endY = o.y;
            d.progress = 0;
            d.speed = 0.008 + Math.random() * 0.008;
            d.phase = "flying-out";
          }
        } else if (d.phase === "flying-out") {
          d.progress = Math.min(1, d.progress + d.speed);
          const e = easeInOut(d.progress);
          d.x = d.targetX + (d.endX - d.targetX) * e;
          d.y = d.targetY + (d.endY - d.targetY) * e;
          if (d.progress >= 1) {
            d.phase = "waiting";
            d.waitTimer = 0;
            d.waitDuration = 40 + Math.floor(Math.random() * 60);
          }
        } else if (d.phase === "waiting") {
          d.waitTimer++;
          if (d.waitTimer >= d.waitDuration) {
            const o = makeOrigin();
            d.startX = o.x;
            d.startY = o.y;
            d.x = d.startX;
            d.y = d.startY;
            d.progress = 0;
            d.speed = 0.008 + Math.random() * 0.008;
            d.delay = Math.floor(Math.random() * 30);
            d.delayTimer = 0;
            d.phase = "flying-in";
          }
          return; // don't draw while waiting
        }

        ctx.fillStyle = d.color;
        ctx.fillRect(
          Math.round(d.x - DOT_SIZE / 2),
          Math.round(d.y - DOT_SIZE / 2),
          DOT_SIZE,
          DOT_SIZE
        );
      });

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
}