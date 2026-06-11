"use client";

import { motion, useReducedMotion } from "framer-motion";

const EMERALD = "#10B981";
const INK = "#1F3A33";

// A cairn is a stack of stones travelers pile to mark a trail. Here the stones
// ARE the structure: the seven hard problems (the "seeds") build and stack on
// each other, crowned by the Apex — the tier where findings synthesize across
// every mission. Laid bottom (widest) → apex (top), like a real cairn.
//
// Geometry: 0 0 420 430 viewBox, centered on x = 210. Each stone has a static
// rotation (outer <g>) so the build animation (inner <motion.g> translateY)
// never clobbers it.
type Stone = { label: string; w: number; rot: number; fill: string };

const SEEDS: Stone[] = [
  { label: "Energy poverty", w: 252, rot: -1.4, fill: "#D8D4CE" },
  { label: "Housing", w: 230, rot: 1.4, fill: "#E4E0D9" },
  { label: "Food waste", w: 208, rot: -1.0, fill: "#D8D4CE" },
  { label: "Clean water", w: 186, rot: 1.6, fill: "#E4E0D9" },
  { label: "Health access", w: 164, rot: -1.4, fill: "#D8D4CE" },
  { label: "Education gaps", w: 142, rot: 1.2, fill: "#E4E0D9" },
  { label: "Climate resilience", w: 120, rot: -1.2, fill: "#D8D4CE" },
];

const STONE_H = 33;
const STEP = 40;
const BASE_Y = 350; // top-edge y of the base stone

const APEX = { label: "APEX", w: 98, rot: 1.4 };

export function CairnStoryVisual() {
  const reduceMotion = useReducedMotion();
  const apexY = BASE_Y - SEEDS.length * STEP; // sits one step above the top seed

  // Bottom-up placement order so the cairn visibly builds itself.
  const placeTransition = (orderFromBottom: number) =>
    reduceMotion
      ? { duration: 0 }
      : {
          delay: 0.12 + orderFromBottom * 0.14,
          type: "spring" as const,
          stiffness: 240,
          damping: 17,
        };

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden="true">
      <div
        className="relative overflow-hidden rounded-3xl border px-6 py-7 sm:px-8 sm:py-9"
        style={{
          borderColor: "rgb(var(--color-foreground) / 0.08)",
          backgroundColor: "rgb(var(--color-card, 255 255 255))",
          boxShadow:
            "0 1px 2px rgb(var(--color-foreground) / 0.04), 0 24px 56px -30px rgb(16 185 129 / 0.4)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${EMERALD}10 0%, transparent 72%)`,
          }}
        />

        <p
          className="relative mb-1 text-center text-[11px] font-mono font-medium uppercase tracking-[0.28em]"
          style={{ color: EMERALD }}
        >
          Why we build cairns
        </p>
        <p
          className="relative mx-auto mb-3 max-w-sm text-center text-[12px] leading-snug"
          style={{ color: "rgb(var(--color-foreground) / 0.5)" }}
        >
          A cairn marks the trail — proof the path is real, and the way is
          shared. Seven hard problems stack into one marker.
        </p>

        <div className="relative mx-auto w-full max-w-[420px]">
          <svg viewBox="0 0 420 430" className="w-full" role="img" aria-label="A cairn of seven mission stones crowned by the Apex">
            {/* trail / horizon with distant cairn marks */}
            <line
              x1="36"
              y1="400"
              x2="384"
              y2="400"
              stroke={EMERALD}
              strokeOpacity="0.22"
              strokeWidth="1.5"
              strokeDasharray="2 7"
            />
            <g fill={EMERALD} fillOpacity="0.32">
              <circle cx="86" cy="400" r="2.5" />
              <circle cx="112" cy="400" r="1.8" />
              <circle cx="322" cy="400" r="2.5" />
              <circle cx="346" cy="400" r="1.8" />
            </g>

            {/* side annotations: Apex crown + the seven seeds */}
            <g
              fontFamily="var(--font-mono, monospace)"
              fontSize="9"
              letterSpacing="0.12em"
              fill={EMERALD}
              opacity="0.85"
            >
              <text x="318" y={apexY + 8} textAnchor="start">APEX</text>
              <text x="318" y={apexY + 20} textAnchor="start" fill={INK} opacity="0.5">synthesis</text>
            </g>
            <g
              fontFamily="var(--font-mono, monospace)"
              fontSize="9"
              letterSpacing="0.12em"
              fill={INK}
              opacity="0.45"
            >
              <text x="44" y={BASE_Y + 24} textAnchor="start">SEEDS · 7 MISSIONS</text>
            </g>

            {/* the seven seed stones — build bottom-up */}
            {SEEDS.map((s, i) => {
              // i = 0 is the base (widest, lowest). Placement order = i (base first).
              const y = BASE_Y - i * STEP;
              const cx = 210;
              const cy = y + STONE_H / 2;
              const x = cx - s.w / 2;
              return (
                <g key={s.label} transform={`rotate(${s.rot} ${cx} ${cy})`}>
                  <motion.g
                    initial={reduceMotion ? false : { opacity: 0, y: -26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={placeTransition(i)}
                  >
                    <ellipse cx={cx} cy={y + STONE_H + 3} rx={s.w / 2 - 6} ry="3.5" fill="#1A1A2C" opacity="0.07" />
                    <rect x={x} y={y} width={s.w} height={STONE_H} rx={STONE_H / 2} fill={s.fill} />
                    <rect
                      x={x + 6}
                      y={y + 3}
                      width={s.w - 12}
                      height={STONE_H / 2 - 2}
                      rx={(STONE_H / 2 - 2) / 2}
                      fill="#FFFFFF"
                      opacity="0.42"
                    />
                    <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="0.01em" fill={INK}>
                      {s.label}
                    </text>
                  </motion.g>
                </g>
              );
            })}

            {/* Apex — the crown, lands last with a soft glow */}
            <g transform={`rotate(${APEX.rot} 210 ${apexY + STONE_H / 2})`}>
              <motion.g
                initial={reduceMotion ? false : { opacity: 0, y: -26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={placeTransition(SEEDS.length)}
              >
                {!reduceMotion && (
                  <motion.ellipse
                    cx="210"
                    cy={apexY + STONE_H / 2}
                    rx={APEX.w / 2 + 14}
                    ry={STONE_H / 2 + 10}
                    fill={EMERALD}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.18, 0.06, 0.14] }}
                    transition={{ delay: 0.12 + SEEDS.length * 0.14 + 0.2, duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <ellipse cx="210" cy={apexY + STONE_H + 3} rx={APEX.w / 2 - 4} ry="3.5" fill="#1A1A2C" opacity="0.08" />
                <rect x={210 - APEX.w / 2} y={apexY} width={APEX.w} height={STONE_H} rx={STONE_H / 2} fill={EMERALD} />
                <rect
                  x={210 - APEX.w / 2 + 6}
                  y={apexY + 3}
                  width={APEX.w - 12}
                  height={STONE_H / 2 - 2}
                  rx={(STONE_H / 2 - 2) / 2}
                  fill="#FFFFFF"
                  opacity="0.22"
                />
                <text x="210" y={apexY + STONE_H / 2 + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="0.08em" fill="#FFFFFF">
                  {APEX.label}
                </text>
              </motion.g>
            </g>
          </svg>
        </div>

        <p
          className="relative mt-2 border-t pt-4 text-center text-[12px] leading-snug"
          style={{
            borderColor: "rgb(var(--color-foreground) / 0.06)",
            color: "rgb(var(--color-foreground) / 0.55)",
          }}
        >
          Each mission is a stone. They build on one another — and the Apex on
          top is where findings synthesize across every mission.
        </p>
      </div>
    </div>
  );
}
