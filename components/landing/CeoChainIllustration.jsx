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
function generateChainLinks(x1, y1, x2, y2, slack = 8) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const numLinks = Math.max(3, Math.floor(dist / 16));
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

// CEO Apex Node
const CEO_NODE = {
  id: "ceo",
  x: 270,
  y: 48,
  title: "FOUNDER / CEO",
  sub: "Master Custodian",
};

// Junction levels along the central spine chain
const JUNCTIONS = [
  { id: "j1", y: 165 },
  { id: "j2", y: 285 },
  { id: "j3", y: 405 },
];

// Dependent hanging nodes branching off the central spine at each junction
const DEPENDENT_NODES = [
  {
    id: "secrets",
    junctionY: 165,
    x: 85,
    y: 165,
    icon: KeyRound,
    title: "SECRETS",
    desc: "Cloud Root & Passwords",
    slack: 8,
  },
  {
    id: "rivals",
    junctionY: 165,
    x: 455,
    y: 165,
    icon: Swords,
    title: "RIVALS",
    desc: "Hostile Takeovers",
    slack: 8,
  },
  {
    id: "plans",
    junctionY: 285,
    x: 105,
    y: 285,
    icon: Target,
    title: "PLANS",
    desc: "Roadmap & Cap Table",
    slack: 8,
  },
  {
    id: "growth",
    junctionY: 285,
    x: 435,
    y: 285,
    icon: TrendingUp,
    title: "GROWTH",
    desc: "Treasury & Valuation",
    slack: 8,
  },
  {
    id: "taxes",
    junctionY: 405,
    x: 125,
    y: 405,
    icon: Receipt,
    title: "TAXES",
    desc: "IRS & Bank Signing",
    slack: 8,
  },
  {
    id: "contracts",
    junctionY: 405,
    x: 415,
    y: 405,
    icon: FileSignature,
    title: "CONTRACTS",
    desc: "Legal IP Handover",
    slack: 8,
  },
];

// Precompute central spine chain from CEO base to terminal lock
const PRECOMPUTED_SPINE = generateChainLinks(270, 74, 270, 465, 0);

// Precompute branch chains from junction points on central spine out to each node
const PRECOMPUTED_BRANCHES = DEPENDENT_NODES.reduce((acc, node) => {
  const isLeft = node.x < 270;
  const attachX = isLeft ? node.x + 26 : node.x - 26;

  acc[node.id] = {
    ...generateChainLinks(270, node.junctionY, attachX, node.y, node.slack),
    // Full traversal path from CEO down the spine and branching to the node
    fullPulsePath: `M 270 74 L 270 ${node.junctionY} Q ${((270 + attachX) / 2).toFixed(1)} ${(node.y + node.slack).toFixed(1)} ${attachX} ${node.y}`,
  };
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

        {/* ================= CENTRAL SPINE CHAIN ================= */}
        <g className="transition-opacity duration-300">
          {/* Guide line down the vertical spine */}
          <line
            x1="270"
            y1="74"
            x2="270"
            y2="465"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Spine 3D Interlocking Links */}
          {PRECOMPUTED_SPINE.links.map((link, idx) => {
            const isOdd = link.isOdd;
            return (
              <g
                key={`spine-link-${idx}`}
                transform={`translate(${link.x}, ${link.y}) rotate(${link.angle})`}
              >
                {isOdd ? (
                  <rect
                    x="-4.5"
                    y="-8"
                    width="9"
                    height="16"
                    rx="4.5"
                    fill="#0c0c12"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="1.6"
                  />
                ) : (
                  <rect
                    x="-2"
                    y="-6.5"
                    width="4"
                    height="13"
                    rx="2"
                    fill="#22222d"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1.2"
                  />
                )}
              </g>
            );
          })}

          {/* Central spine terminal anchor lock at bottom */}
          <g transform="translate(270, 472)">
            <circle
              r="10"
              fill="#120606"
              stroke="#ff3b19"
              strokeWidth="1.8"
              className="filter drop-shadow-[0_0_8px_rgba(255,59,25,0.4)]"
            />
            <foreignObject x="-6" y="-6" width="12" height="12">
              <div className="w-full h-full flex items-center justify-center text-[#ff3b19]">
                <Lock size={9} strokeWidth={2.5} />
              </div>
            </foreignObject>
          </g>
        </g>

        {/* ================= BRANCH CHAINS LAYER ================= */}
        {DEPENDENT_NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const branch = PRECOMPUTED_BRANCHES[node.id];
          const isLeft = node.x < 270;
          const attachX = isLeft ? node.x + 26 : node.x - 26;

          return (
            <g key={`branch-${node.id}`} className="transition-opacity duration-300">
              {/* Underlying branch guide cable */}
              <path
                d={branch.pathD}
                fill="none"
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.12)"}
                strokeWidth={isHovered ? 2.2 : 1}
                strokeDasharray={isHovered ? "none" : "3 3"}
                className="transition-all duration-300"
              />

              {/* Individual Branch Chain Links */}
              {branch.links.map((link, lIdx) => {
                const isOdd = link.isOdd;
                return (
                  <g
                    key={`branch-link-${node.id}-${lIdx}`}
                    transform={`translate(${link.x}, ${link.y}) rotate(${link.angle})`}
                  >
                    {isOdd ? (
                      <rect
                        x="-4"
                        y="-7"
                        width="8"
                        height="14"
                        rx="4"
                        fill="#0c0c12"
                        stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.38)"}
                        strokeWidth="1.4"
                      />
                    ) : (
                      <rect
                        x="-1.8"
                        y="-5.5"
                        width="3.6"
                        height="11"
                        rx="1.8"
                        fill={isHovered ? "#ff3b19" : "#22222d"}
                        stroke={isHovered ? "#ff5233" : "rgba(255, 255, 255, 0.2)"}
                        strokeWidth="1.1"
                      />
                    )}
                  </g>
                );
              })}

              {/* Anchor Eyelet at node connection edge */}
              <circle
                cx={attachX}
                cy={node.y}
                r="3"
                fill={isHovered ? "#ff3b19" : "#ffffff"}
                stroke="#000"
                strokeWidth="1"
              />

              {/* Constant Red Signal Pulse: Traversing down the spine and branching to this node (1.5s) */}
              <circle r="4" fill="#ff3b19" filter="url(#crimson-pulse-glow)">
                <animateMotion
                  path={branch.fullPulsePath}
                  dur="1.6s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
              <circle r="7" fill="#ff3b19" opacity="0.4">
                <animateMotion
                  path={branch.fullPulsePath}
                  dur="1.6s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
            </g>
          );
        })}

        {/* ================= JUNCTION DISTRIBUTION RINGS ================= */}
        {JUNCTIONS.map((j) => (
          <g key={`junction-${j.id}`} transform={`translate(270, ${j.y})`}>
            {/* Heavy steel shackle hub ring */}
            <circle
              r="6.5"
              fill="#120808"
              stroke="#ff3b19"
              strokeWidth="2"
              className="filter drop-shadow-[0_0_6px_rgba(255,59,25,0.45)]"
            />
            <circle r="2.5" fill="#ffffff" />
          </g>
        ))}

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

          {/* Shackle connection ring at base of CEO node */}
          <circle
            cx="0"
            cy="26"
            r="4"
            fill="#ff3b19"
            stroke="#000"
            strokeWidth="1"
          />

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
          const isLeft = node.x < 270;

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

              {/* Eyelet hook on the inner side toward the central spine */}
              <rect
                x={isLeft ? "23" : "-29"}
                y="-3"
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
        <span>Central Spine Network // All Directives Sever Upon Silence</span>
      </div>
    </div>
  );
}
