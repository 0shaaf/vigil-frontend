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

// Procedurally generate authentic interlocking chain links along a catenary curve
function generateChainLinks(x1, y1, x2, y2, slack = 14) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const numLinks = Math.max(4, Math.floor(dist / 15));
  const links = [];

  for (let i = 1; i < numLinks; i++) {
    const t = i / numLinks;
    // Quadratic bezier curve accounting for natural gravitational chain sag
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + slack;

    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

    const tx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx);
    const ty = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy);
    const angle = (Math.atan2(ty, tx) * 180) / Math.PI;

    links.push({
      x,
      y,
      angle,
      isOdd: i % 2 === 1,
    });
  }

  return {
    links,
    pathD: `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + slack} ${x2} ${y2}`,
  };
}

export default function CeoChainIllustration() {
  const [hoveredNode, setHoveredNode] = useState(null);

  // CEO Apex Node
  const ceoNode = {
    id: "ceo",
    x: 270,
    y: 56,
    icon: Crown,
    title: "FOUNDER / CEO",
    sub: "Master Custodian",
  };

  // 6 Dependent hanging nodes
  const dependentNodes = [
    {
      id: "secrets",
      x: 75,
      y: 195,
      icon: KeyRound,
      title: "SECRETS",
      desc: "Cloud Root & Passwords",
      slack: 18,
    },
    {
      id: "plans",
      x: 195,
      y: 230,
      icon: Target,
      title: "PLANS",
      desc: "Roadmap & Cap Table",
      slack: 12,
    },
    {
      id: "growth",
      x: 345,
      y: 230,
      icon: TrendingUp,
      title: "GROWTH",
      desc: "Treasury & Valuation",
      slack: 12,
    },
    {
      id: "rivals",
      x: 465,
      y: 195,
      icon: Swords,
      title: "RIVALS",
      desc: "Hostile Takeovers",
      slack: 18,
    },
    {
      id: "taxes",
      x: 130,
      y: 385,
      icon: Receipt,
      title: "TAXES",
      desc: "IRS & Bank Signing",
      slack: 26,
    },
    {
      id: "contracts",
      x: 410,
      y: 385,
      icon: FileSignature,
      title: "CONTRACTS",
      desc: "Legal IP Handover",
      slack: 26,
    },
  ];

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none p-2 sm:p-4">
      {/* Ambient background glow under the CEO node */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff3b19]/15 rounded-full blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 540 480"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Subtle chain metallic gradient */}
          <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#454552" />
            <stop offset="50%" stopColor="#1e1e26" />
            <stop offset="100%" stopColor="#0a0a0f" />
          </linearGradient>

          <linearGradient id="active-chain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5233" />
            <stop offset="100%" stopColor="#ff3b19" />
          </linearGradient>

          <filter id="crimson-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= CHAINS LAYER ================= */}
        {dependentNodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const { links, pathD } = generateChainLinks(
            ceoNode.x,
            ceoNode.y + 24,
            node.x,
            node.y - 24,
            node.slack
          );

          return (
            <g key={`chain-${node.id}`} className="transition-opacity duration-300">
              {/* Underlying guide cable with glow on hover */}
              <path
                d={pathD}
                fill="none"
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.15)"}
                strokeWidth={isHovered ? 2.5 : 1.2}
                strokeDasharray={isHovered ? "none" : "3 3"}
                className="transition-all duration-300"
              />

              {/* Individual 3D Interlocking Chain Links */}
              {links.map((link, lIdx) => {
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
                        stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.45)"}
                        strokeWidth="1.6"
                      />
                    ) : (
                      // Edge-on Link (sideways connector loop)
                      <rect
                        x="-2"
                        y="-6"
                        width="4"
                        height="12"
                        rx="2"
                        fill={isHovered ? "#ff3b19" : "#22222d"}
                        stroke={isHovered ? "#ff5233" : "rgba(255, 255, 255, 0.25)"}
                        strokeWidth="1.2"
                      />
                    )}
                  </g>
                );
              })}

              {/* Top Anchor Shackle at CEO connection point */}
              <circle
                cx={ceoNode.x}
                cy={ceoNode.y + 24}
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
            </g>
          );
        })}

        {/* ================= CEO APEX NODE ================= */}
        <g
          transform={`translate(${ceoNode.x}, ${ceoNode.y})`}
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
              {ceoNode.title}
            </text>
          </g>
        </g>

        {/* ================= DEPENDENT HANGING NODES ================= */}
        {dependentNodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const Icon = node.icon;

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group transition-transform duration-300"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                transform: `translate(${node.x}px, ${node.y}px) ${
                  isHovered ? "scale(1.08)" : "scale(1)"
                }`,
                transformOrigin: `${node.x}px ${node.y}px`,
              }}
            >
              {/* Outer decorative ring */}
              <circle
                r="26"
                fill={isHovered ? "#160909" : "#0d0d14"}
                stroke={isHovered ? "#ff3b19" : "rgba(255, 255, 255, 0.2)"}
                strokeWidth={isHovered ? "2" : "1.4"}
                className="transition-all duration-300 shadow-lg"
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
                  className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
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
                  className="transition-all duration-300"
                />
                <text
                  textAnchor="middle"
                  y="3"
                  fill={isHovered ? "#ff3b19" : "#e0e0e0"}
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                  fontFamily="Space Grotesk, sans-serif"
                  className="transition-colors duration-300"
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
