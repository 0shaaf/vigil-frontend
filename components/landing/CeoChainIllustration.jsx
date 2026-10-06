"use client";

import { useState } from "react";
import {
  Crown,
  KeyRound,
  Target,
  TrendingUp,
  Swords,
  Receipt,
  FileSignature,
  Lock,
} from "lucide-react";

// Procedurally generate static interlocking chain links along a catenary curve
function generateChainLinks(x1, y1, x2, y2, slack = 14) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const numLinks = Math.max(4, Math.floor(dist / 17));
  const links = [];

  const cx = Number(((x1 + x2) / 2).toFixed(1));
  const cy = Number(((y1 + y2) / 2 + slack).toFixed(1));

  for (let i = 1; i < numLinks; i++) {
    const t = i / numLinks;
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

    const tx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx);
    const ty = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy);
    const angle = (Math.atan2(ty, tx) * 180) / Math.PI;

    links.push({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      angle: Number(angle.toFixed(1)),
      isOdd: i % 2 === 1,
    });
  }

  return {
    links,
    pathD: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
  };
}

// Fixed coordinate layout ensuring ZERO chain overlaps between layers
const CEO_NODE = {
  id: "ceo",
  x: 270,
  y: 48,
  title: "FOUNDER / CEO",
  sub: "Master Custodian",
};

// Lengthened chains with non-overlapping radiating fan angles
const DEPENDENT_NODES = [
  {
    id: "secrets",
    x: 65,
    y: 230,
    icon: KeyRound,
    title: "SECRETS",
    desc: "Cloud Root & Passwords",
    slack: 12,
  },
  {
    id: "plans",
    x: 226,
    y: 260,
    icon: Target,
    title: "PLANS",
    desc: "Roadmap & Cap Table",
    slack: 8,
  },
  {
    id: "growth",
    x: 314,
    y: 260,
    icon: TrendingUp,
    title: "GROWTH",
    desc: "Treasury & Valuation",
    slack: 8,
  },
  {
    id: "rivals",
    x: 475,
    y: 230,
    icon: Swords,
    title: "RIVALS",
    desc: "Hostile Takeovers",
    slack: 12,
  },
  {
    id: "taxes",
    x: 105,
    y: 440,
    icon: Receipt,
    title: "TAXES",
    desc: "IRS & Bank Signing",
    slack: 16,
  },
  {
    id: "contracts",
    x: 435,
    y: 440,
    icon: FileSignature,
    title: "CONTRACTS",
    desc: "Legal IP Handover",
    slack: 16,
  },
];

// Precompute static chains outside component to eliminate SSR/Client hydration variance
const PRECOMPUTED_CHAINS = DEPENDENT_NODES.reduce((acc, node) => {
  acc[node.id] = generateChainLinks(
    CEO_NODE.x,
    CEO_NODE.y + 24,
    node.x,
    node.y - 24,
    node.slack
  );
  return acc;
}, {});

export default function CeoChainIllustration() {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none p-2 sm:p-4">
      {/* Ambient background glow under the CEO node */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff3b19]/15 rounded-full blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 540 520"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <filter id="crimson-pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= CHAINS LAYER ================= */}
        {DEPENDENT_NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const chain = PRECOMPUTED_CHAINS[node.id];

          return (
            <g key={`chain-${node.id}`} className="transition-opacity duration-300">
              {/* Underlying guide cable */}
              <path
                d={chain.pathD}
                fill="none"
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.12)"}
                strokeWidth={isHovered ? 2.2 : 1}
                strokeDasharray={isHovered ? "none" : "3 3"}
                className="transition-all duration-300"
              />

              {/* Individual 3D Interlocking Chain Links */}
              {chain.links.map((link, lIdx) => {
                const isOdd = link.isOdd;
                return (
                  <g
                    key={`link-${node.id}-${lIdx}`}
                    transform={`translate(${link.x}, ${link.y}) rotate(${link.angle})`}
                  >
                    {isOdd ? (
                      // Flat Link (facing viewer)
                      <rect
                        x="-4.5"
                        y="-7.5"
                        width="9"
                        height="15"
                        rx="4.5"
                        fill="#0c0c12"
                        stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.4)"}
                        strokeWidth="1.5"
                      />
                    ) : (
                      // Edge-on Link (connector loop)
                      <rect
                        x="-2"
                        y="-6"
                        width="4"
                        height="12"
                        rx="2"
                        fill={isHovered ? "#ff3b19" : "#22222d"}
                        stroke={isHovered ? "#ff5233" : "rgba(255, 255, 255, 0.22)"}
                        strokeWidth="1.2"
                      />
                    )}
                  </g>
                );
              })}

              {/* Top Anchor Shackle at CEO connection point */}
              <circle
                cx={CEO_NODE.x}
                cy={CEO_NODE.y + 24}
                r="3"
                fill="#ff3b19"
                stroke="#000"
                strokeWidth="1"
              />

              {/* Bottom Anchor Eyelet at dependent node top */}
              <circle
                cx={node.x}
                cy={node.y - 24}
                r="3"
                fill={isHovered ? "#ff3b19" : "#ffffff"}
                stroke="#000"
                strokeWidth="1"
              />

              {/* Constant Red Signal Pulse traversing down from CEO to each node (takes 1.5s) */}
              <circle r="4" fill="#ff3b19" filter="url(#crimson-pulse-glow)">
                <animateMotion
                  path={chain.pathD}
                  dur="1.5s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
              <circle r="7" fill="#ff3b19" opacity="0.4">
                <animateMotion
                  path={chain.pathD}
                  dur="1.5s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
            </g>
          );
        })}

        {/* ================= CEO APEX NODE ================= */}
        <g
          transform={`translate(${CEO_NODE.x}, ${CEO_NODE.y})`}
          className="cursor-pointer group"
          onMouseEnter={() => setHoveredNode("ceo")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Pulsing Outer Halo */}
          <circle
            r="38"
            fill="none"
            stroke="#ff3b19"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-spin-slow opacity-60"
            style={{ transformOrigin: "0 0", animationDuration: "24s" }}
          />

          <circle
            r="32"
            fill="#120606"
            stroke="#ff3b19"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_15px_rgba(255,59,25,0.6)] transition-all duration-300 group-hover:stroke-[#ff5233]"
          />

          {/* Inner dark core */}
          <circle r="26" fill="#180a0a" />

          {/* Icon in Center */}
          <foreignObject x="-14" y="-14" width="28" height="28">
            <div className="w-full h-full flex items-center justify-center text-[#ff3b19]">
              <Crown size={22} strokeWidth={2.5} />
            </div>
          </foreignObject>

          {/* Pill Badge Tag Below */}
          <g transform="translate(0, 44)">
            <rect
              x="-64"
              y="-10"
              width="128"
              height="20"
              rx="10"
              fill="#07070a"
              stroke="#ff3b19"
              strokeWidth="1"
            />
            <text
              textAnchor="middle"
              y="3.5"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.1em"
              fontFamily="Space Grotesk, sans-serif"
            >
              {CEO_NODE.title}
            </text>
          </g>
        </g>

        {/* ================= DEPENDENT HANGING NODES ================= */}
        {DEPENDENT_NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const Icon = node.icon;

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer decorative ring (subtle scale on hover without layout jump) */}
              <circle
                r="26"
                fill={isHovered ? "#160909" : "#0d0d14"}
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.2)"}
                strokeWidth={isHovered ? "2.2" : "1.4"}
                className="transition-all duration-200"
                style={{
                  transform: isHovered ? "scale(1.025)" : "scale(1)",
                  transformOrigin: "0 0",
                }}
              />

              {/* Eyelet hook at top */}
              <rect
                x="-3"
                y="-27"
                width="6"
                height="6"
                rx="2"
                fill="#20202c"
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.3)"}
                strokeWidth="1"
              />

              {/* Icon Container */}
              <foreignObject x="-12" y="-12" width="24" height="24">
                <div
                  className={`w-full h-full flex items-center justify-center transition-colors duration-200 ${
                    isHovered ? "text-[#ff3b19]" : "text-white/80"
                  }`}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </div>
              </foreignObject>

              {/* Node Title Badge */}
              <g transform="translate(0, 34)">
                <rect
                  x="-42"
                  y="-8"
                  width="84"
                  height="16"
                  rx="8"
                  fill="#08080c"
                  stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth="0.9"
                  className="transition-all duration-200"
                />
                <text
                  textAnchor="middle"
                  y="3"
                  fill={isHovered ? "#ff3b19" : "#e0e0e0"}
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                  fontFamily="Space Grotesk, sans-serif"
                  className="transition-colors duration-200"
                >
                  {node.title}
                </text>
              </g>

              {/* Small description line */}
              <text
                textAnchor="middle"
                y="52"
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="7"
                fontWeight="500"
                fontFamily="sans-serif"
              >
                {node.desc}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Subtitle status pill at bottom */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
        <Lock size={11} className="text-[#ff3b19]" />
        <span>Single Point of Failure // All Directives Sever Upon Silence</span>
      </div>
    </div>
  );
}
