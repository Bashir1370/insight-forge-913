import type { SVGProps } from "react";

type RnaExtractionSceneProps = {
  active?: boolean;
  className?: string;
};

export function RnaExtractionSceneV2({
  active = true,
  className = "",
}: RnaExtractionSceneProps) {
  return (
    <div
      dir="rtl"
      className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white ${className}`}
    >
      <svg
        viewBox="0 0 1280 500"
        role="img"
        aria-label="نمای شماتیک علمی مراحل استخراج RNA"
        className="block h-auto w-full"
      >
        <defs>
          <linearGradient id="rnaSceneBgV2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#ecfeff" />
          </linearGradient>

          <linearGradient id="tubeGlassV2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="sampleV2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          <linearGradient id="eluateV2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <filter id="cardShadowV2" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.10" />
          </filter>

          <marker
            id="arrowHeadV2"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e" />
          </marker>
        </defs>

        <rect x="0" y="0" width="1280" height="500" rx="34" fill="url(#rnaSceneBgV2)" />

        {/* connector: sample -> extraction */}
        <line
          x1="965"
          y1="245"
          x2="790"
          y2="245"
          stroke="#0f766e"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#arrowHeadV2)"
        />

        {/* connector: extraction -> purified RNA */}
        <line
          x1="495"
          y1="245"
          x2="320"
          y2="245"
          stroke="#0f766e"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#arrowHeadV2)"
        />

        {/* Stage 1 — biological sample */}
        <g transform="translate(965 80)" filter="url(#cardShadowV2)">
          <rect width="250" height="330" rx="30" fill="#ffffff" stroke="#dbeafe" strokeWidth="2" />

          {/* culture dish */}
          <g transform="translate(36 42)">
            <ellipse cx="89" cy="65" rx="80" ry="45" fill="#fff1f2" stroke="#be123c" strokeWidth="3" />
            <ellipse cx="89" cy="63" rx="70" ry="35" fill="#fecdd3" opacity="0.45" />

            {[
              [45, 58], [68, 47], [91, 63], [118, 51], [137, 72], [69, 78], [112, 82],
            ].map(([cx, cy], index) => (
              <g key={index}>
                <circle cx={cx} cy={cy} r="10" fill="#fda4af" stroke="#e11d48" strokeWidth="1.8" />
                <circle cx={cx} cy={cy} r="3.5" fill="#9f1239" opacity="0.9" />
              </g>
            ))}
          </g>

          {/* sample collection tube */}
          <g transform="translate(88 155)">
            <rect x="0" y="0" width="76" height="19" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <path d="M10 17 L66 17 L58 103 Q38 126 18 103 Z" fill="url(#tubeGlassV2)" stroke="#64748b" strokeWidth="2.4" />
            <path d="M19 76 L57 76 L53 101 Q38 116 23 101 Z" fill="url(#sampleV2)" opacity="0.92" />
            <path d="M20 76 Q38 69 56 76" fill="none" stroke="#fecdd3" strokeWidth="2" />
          </g>

          <text x="125" y="300" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a" fontFamily="inherit">
            نمونه زیستی
          </text>
        </g>

        {/* Stage 2 — RNA extraction: lysis + spin-column purification */}
        <g transform="translate(515 70)" filter="url(#cardShadowV2)">
          <rect width="270" height="350" rx="30" fill="#ffffff" stroke="#99f6e4" strokeWidth="2" />

          {/* pipette */}
          <g transform="translate(36 36) rotate(-12 42 42)">
            <rect x="18" y="4" width="35" height="92" rx="10" fill="#dbeafe" stroke="#475569" strokeWidth="2.2" />
            <rect x="24" y="12" width="23" height="42" rx="7" fill="#0f766e" opacity="0.9" />
            <path d="M28 95 L44 95 L39 150 L33 150 Z" fill="#bae6fd" stroke="#475569" strokeWidth="1.8" />
            <path d="M34 150 L38 150 L36 163 Z" fill="#22d3ee" />
          </g>

          {/* lysis tube */}
          <g transform="translate(87 56)">
            <rect x="0" y="0" width="74" height="18" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <path d="M10 16 L64 16 L57 114 Q37 137 17 114 Z" fill="url(#tubeGlassV2)" stroke="#475569" strokeWidth="2.4" />
            <path d="M18 74 L56 74 L52 112 Q37 128 22 112 Z" fill="#67e8f9" opacity="0.72" />
            <path d="M22 92 C28 79, 34 105, 41 91 C48 79, 53 102, 57 90" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* spin column + collection tube */}
          <g transform="translate(155 64)">
            <rect x="5" y="0" width="72" height="18" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <path d="M14 16 L68 16 L58 82 L24 82 Z" fill="#ecfeff" stroke="#475569" strokeWidth="2.2" />
            <rect x="24" y="60" width="34" height="9" rx="3" fill="#0f766e" opacity="0.85" />
            <path d="M21 81 L61 81 L56 141 Q41 158 26 141 Z" fill="url(#tubeGlassV2)" stroke="#64748b" strokeWidth="2.2" />
            <path d="M27 124 L55 124 L52 140 Q41 150 30 140 Z" fill="url(#eluateV2)" opacity="0.7" />
          </g>

          {/* subtle processing arrows */}
          <path d="M135 112 C151 102, 162 102, 177 110" fill="none" stroke="#0f766e" strokeWidth="3" strokeDasharray="7 7" markerEnd="url(#arrowHeadV2)" />

          {/* molecular inset */}
          <g transform="translate(77 207)">
            <circle cx="58" cy="45" r="43" fill="#ecfeff" stroke="#5eead4" strokeWidth="2" />
            <path d="M27 38 C34 21, 43 55, 52 36 C60 20, 70 54, 80 36 C88 22, 96 48, 101 35" fill="none" stroke="#0f766e" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M29 53 C36 36, 45 68, 54 51 C63 35, 72 66, 81 50 C89 36, 96 60, 101 49" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" />
          </g>

          {active && (
            <circle cx="135" cy="176" r="7" fill="#14b8a6" opacity="0.45">
              <animate attributeName="r" values="6;10;6" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.2s" repeatCount="indefinite" />
            </circle>
          )}

          <text x="135" y="322" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a" fontFamily="inherit">
            استخراج RNA
          </text>
        </g>

        {/* Stage 3 — purified RNA */}
        <g transform="translate(65 80)" filter="url(#cardShadowV2)">
          <rect width="250" height="330" rx="30" fill="#ffffff" stroke="#dbeafe" strokeWidth="2" />

          {/* purified RNA tube */}
          <g transform="translate(87 38)">
            <rect x="0" y="0" width="76" height="19" rx="6" fill="#dbeafe" stroke="#64748b" strokeWidth="2" />
            <path d="M10 17 L66 17 L58 133 Q38 157 18 133 Z" fill="url(#tubeGlassV2)" stroke="#64748b" strokeWidth="2.4" />
            <path d="M20 112 L56 112 L52 132 Q38 147 24 132 Z" fill="url(#eluateV2)" opacity="0.78" />
          </g>

          {/* RNA magnifier */}
          <g transform="translate(25 73)">
            <circle cx="55" cy="55" r="50" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2.4" />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M23 ${39 + i * 15} C34 ${21 + i * 15}, 45 ${58 + i * 15}, 57 ${39 + i * 15} C68 ${22 + i * 15}, 81 ${58 + i * 15}, 91 ${39 + i * 15}`}
                fill="none"
                stroke={i % 2 === 0 ? "#2563eb" : "#0f766e"}
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            ))}
          </g>

          <text x="125" y="300" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a" fontFamily="inherit">
            RNA خالص
          </text>
        </g>
      </svg>
    </div>
  );
}

export function RnaExtractionMiniIconV2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <rect x="18" y="7" width="28" height="8" rx="3" fill="#dbeafe" stroke="#475569" strokeWidth="2" />
      <path d="M22 14 L42 14 L39 48 Q32 56 25 48 Z" fill="#ecfeff" stroke="#475569" strokeWidth="2" />
      <path d="M26 38 L38 38 L36 48 Q32 52 28 48 Z" fill="#67e8f9" opacity="0.85" />
      <path d="M24 27 C28 20, 31 33, 35 26 C39 20, 41 31, 43 26" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
