"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Visual & physics radius */
  r: number;
  /** ~ area; larger bodies pull smaller ones */
  mass: number;
};

const CONNECT_DIST_BASE = 100;
const LINE_ALPHA_MAX = 0.2;
const JITTER_LIGHT = 0.008;
const JITTER_HEAVY = 0.002;

/** Gravity-like pull: only heavier → lighter; softened to avoid slingshot singularities */
const ATTRACT_K = 0.045;
const INFLUENCE = 168;
const SOFT = 42;

/** Must be this much heavier to influence the other */
const MASS_RATIO = 1.22;

/** Push out of overlap (torus-aware) */
const SEP_EXTRA = 10;
const SEP_STRENGTH = 0.11;

function wrapCoord(v: number, dim: number) {
  let t = v;
  while (t < 0) t += dim;
  while (t >= dim) t -= dim;
  return t;
}

function torusDelta(ax: number, ay: number, bx: number, by: number, w: number, h: number) {
  let dx = bx - ax;
  let dy = by - ay;
  if (dx > w / 2) dx -= w;
  if (dx < -w / 2) dx += w;
  if (dy > h / 2) dy -= h;
  if (dy < -h / 2) dy += h;
  const d = Math.hypot(dx, dy);
  return { dx, dy, d };
}

function maxSpeedForMass(mass: number) {
  return 0.26 + 0.62 / Math.sqrt(mass);
}

function clampSpeed(p: Particle) {
  const cap = maxSpeedForMass(p.mass);
  const s = Math.hypot(p.vx, p.vy);
  if (s > cap) {
    p.vx = (p.vx / s) * cap;
    p.vy = (p.vy / s) * cap;
  }
}

export function HeroParticleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = container;
    const cv = canvas;
    const c = ctx;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let particles: Particle[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    function pickRadius(): { r: number; mass: number } {
      const t = Math.random();
      let r: number;
      if (t < 0.11) {
        r = 2.35 + Math.random() * 1.35;
      } else if (t < 0.36) {
        r = 1.32 + Math.random() * 0.55;
      } else {
        r = 0.65 + Math.random() * 0.48;
      }
      const mass = r * r;
      return { r, mass };
    }

    function makeParticles(cw: number, ch: number) {
      const count = Math.min(78, Math.max(30, Math.floor((cw * ch) / 19000)));
      particles = Array.from({ length: count }, () => {
        const { r, mass } = pickRadius();
        return {
          x: Math.random() * cw,
          y: Math.random() * ch,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r,
          mass,
        };
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      if (w < 1 || h < 1) return;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles(w, h);
    }

    function step() {
      for (const p of particles) {
        const jitter = p.mass > 3.5 ? JITTER_HEAVY : JITTER_LIGHT;
        p.vx += (Math.random() - 0.5) * jitter;
        p.vy += (Math.random() - 0.5) * jitter;

        // Larger bodies pull smaller ones (inverse-square + softening, capped range)
        for (const heavy of particles) {
          if (heavy === p) continue;
          if (heavy.mass < p.mass * MASS_RATIO) continue;

          const { dx, dy, d } = torusDelta(p.x, p.y, heavy.x, heavy.y, w, h);
          if (d < 0.5 || d > INFLUENCE) continue;

          const falloff = 1 - d / INFLUENCE;
          const denom = d * d + SOFT * SOFT;
          let strength = (ATTRACT_K * heavy.mass * falloff) / denom;
          strength /= p.mass;

          const cap = 0.055;
          if (strength > cap) strength = cap;

          p.vx += (dx / d) * strength;
          p.vy += (dy / d) * strength;
        }

        // Hard overlap separation (all pairs; lighter moves more)
        for (const o of particles) {
          if (o === p) continue;
          const { dx, dy, d } = torusDelta(p.x, p.y, o.x, o.y, w, h);
          const minD = p.r + o.r + SEP_EXTRA;
          if (d > 0 && d < minD) {
            const overlap = minD - d;
            const wOther = 1 / (1 + o.mass);
            const wSelf = 1 / (1 + p.mass);
            const share = wSelf / (wSelf + wOther);
            const push = (overlap / minD) * SEP_STRENGTH * share;
            p.vx -= (dx / d) * push;
            p.vy -= (dy / d) * push;
          }
        }

        clampSpeed(p);

        p.x += p.vx;
        p.y += p.vy;
        p.x = wrapCoord(p.x, w);
        p.y = wrapCoord(p.y, h);

        clampSpeed(p);
      }
    }

    function draw() {
      c.clearRect(0, 0, w, h);

      const n = particles.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = particles[i];
          const b = particles[j];
          const { d } = torusDelta(a.x, a.y, b.x, b.y, w, h);
          const connect = CONNECT_DIST_BASE + (a.r + b.r) * 4;
          if (d < connect) {
            const t = 1 - d / connect;
            const alpha = t * LINE_ALPHA_MAX;
            c.strokeStyle = `rgba(255,255,255,${alpha})`;
            c.lineWidth = 0.5;
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.stroke();
          }
        }
      }

      for (const p of particles) {
        const alpha = 0.35 + Math.min(0.45, p.r * 0.12);
        c.fillStyle = `rgba(255,255,255,${alpha})`;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      }
    }

    function tick() {
      step();
      draw();
      raf = requestAnimationFrame(tick);
    }

    function drawOnce() {
      draw();
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawOnce();
    });
    ro.observe(container);

    if (reducedMotion) {
      drawOnce();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
