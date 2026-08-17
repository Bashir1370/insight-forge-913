import type { SVGProps } from "react";

type RnaExtractionSceneProps = {
  active?: boolean;
  className?: string;
  showLabels?: boolean;
};

export function RnaExtractionScene({
  active = true,
  className = "",
  showLabels = true,
}: RnaExtractionSceneProps) {
  return (
    <div
      dir="rtl"
      className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white ${className}`}
    >
      <svg
        viewBox="0 0 1200 520"
        role="img"
        aria-label="نمای شماتیک استخراج RNA از نمونه زیستی"
        className="block h-auto w-full"
      >
        <defs>
          <linearGradient id="panelBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#ecfeff" />
          </linearGradient>

          <linearGradient id="sampleLiquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="rnaLiquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="tubeGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="65%" stopColor="#e0f2fe" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.35" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>

          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <marker
            id="arrowHead"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e" />
          </marker>
        </defs>

        <rect x="0" y="0" width="1200" height="520" rx="34" fill="url(#panelBg)" />

        {/* title */}
        {showLabels && (
          <g fontFamily="inherit" fill="#0f172a">
            <text x="1115" y="66" textAnchor="end" fontSize="28" fontWeight="800">
              استخراج RNA
            </text>
            <text x="1115" y="99" textAnchor="end" fontSize="16" fill="#64748b">
              جداسازی RNA از نمونه زیستی و آماده‌سازی برای مراحل بعدی
            </text>
          </g>
        )}

        {/* stage 1: biological sample */}
        <g transform="translate(900 155)" filter="url(#softShadow)">
          <rect x="0" y="0" width="225" height="265" rx="28" fill="#ffffff" stroke="#dbeafe" strokeWidth="2" />

          {/* tissue icon */}
          <g transform="translate(47 36)">
            <path
              d="M18 38 C34 8, 92 0, 119 20 C144 38, 143 84, 118 107 C89 135, 33 123, 12 90 C2 74, 5 54, 18 38 Z"
              fill="#fda4af"
              stroke="#be123c"
              strokeWidth="3"
            />
            <circle cx="62" cy="60" r="15" fill="#881337" opacity="0.75" />
            <circle cx="28" cy="63" r="4" fill="#be123c" opacity="0.7" />
            <circle cx="99" cy="84" r="5" fill="#be123c" opacity="0.7" />
          </g>

          {/* sample tube */}
          <g transform="translate(75 135)">
            <rect x="0" y="0" width="72" height="18" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path d="M10 16 L62 16 L54 91 Q36 110 18 91 Z" fill="url(#tubeGlass)" stroke="#64748b" strokeWidth="2.5" />
            <path d="M18 65 L54 65 L50 91 Q36 104 22 91 Z" fill="url(#sampleLiquid)" />
            <path d="M18 66 Q36 58 54 66" fill="none" stroke="#fecdd3" strokeWidth="2" />
          </g>

          {showLabels && (
            <g fontFamily="inherit" textAnchor="middle">
              <text x="112" y="218" fontSize="17" fontWeight="800" fill="#0f172a">
                نمونه زیستی
              </text>
              <text x="112" y="244" fontSize="13" fill="#64748b">
                بافت، سلول یا مایع زیستی
              </text>
            </g>
          )}
        </g>

        {/* arrow 1 */}
        <line
          x1="870"
          y1="287"
          x2="742"
          y2="287"
          stroke="#0f766e"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#arrowHead)"
        />

        {/* moving particles into extraction */}
        {active && (
          <g fill="#14b8a6">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="850" cy={275 + i * 12} r="4" opacity="0.8">
                <animate attributeName="cx" values="850;770" dur="1.8s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

        {/* stage 2: extraction tube */}
        <g transform="translate(495 150)" filter="url(#softShadow)">
          <rect x="0" y="0" width="250" height="275" rx="28" fill="#ffffff" stroke="#ccfbf1" strokeWidth="2" />

          <g transform="translate(81 36)">
            <rect x="0" y="0" width="88" height="20" rx="7" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
            <path d="M12 18 L76 18 L66 140 Q44 166 22 140 Z" fill="url(#tubeGlass)" stroke="#475569" strokeWidth="2.5" />
            <path d="M22 96 L66 96 L61 139 Q44 158 27 139 Z" fill="url(#rnaLiquid)" />
            <path d="M23 98 Q44 89 65 98" fill="none" stroke="#a5f3fc" strokeWidth="2" />

            {/* RNA strands inside tube */}
            <g stroke="#2563eb" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M31 114 C36 105, 43 123, 49 114 C55 105, 60 121, 63 114" />
              <path d="M30 126 C35 117, 40 134, 46 125 C52 116, 58 132, 62 125" />
            </g>
          </g>

          {/* molecular callout */}
          <g transform="translate(22 30)">
            <circle cx="36" cy="36" r="31" fill="#ecfeff" stroke="#5eead4" strokeWidth="2" />
            <path d="M18 34 C24 20, 30 48, 37 32 C44 18, 51 48, 56 30" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 44 C25 32, 31 56, 38 42 C45 29, 51 53, 55 41" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          </g>

          {showLabels && (
            <g fontFamily="inherit" textAnchor="middle">
              <text x="125" y="220" fontSize="17" fontWeight="800" fill="#0f172a">
                جداسازی RNA
              </text>
              <text x="125" y="246" fontSize="13" fill="#64748b">
                حذف اجزای مزاحم و بازیابی RNA
              </text>
            </g>
          )}
        </g>

        {/* arrow 2 */}
        <line
          x1="465"
          y1="287"
          x2="335"
          y2="287"
          stroke="#0f766e"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#arrowHead)"
        />

        {active && (
          <g stroke="#2563eb" strokeWidth="2.5" fill="none" opacity="0.9">
            <path d="M448 273 C455 262, 463 285, 470 273" transform="translate(-10 0)">
              <animateTransform attributeName="transform" type="translate" values="0 0;-92 0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M448 294 C455 283, 463 306, 470 294" transform="translate(-10 0)">
              <animateTransform attributeName="transform" type="translate" values="0 0;-92 0" dur="2s" begin="0.55s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.55s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* stage 3: purified RNA */}
        <g transform="translate(75 150)" filter="url(#softShadow)">
          <rect x="0" y="0" width="260" height="275" rx="28" fill="#ffffff" stroke="#dbeafe" strokeWidth="2" />

          <g transform="translate(32 30)">
            <circle cx="58" cy="58" r="50" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />

            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M${26 + i * 5} ${42 + i * 10} C${38 + i * 4} ${25 + i * 9}, ${51 + i * 4} ${61 + i * 8}, ${68 + i * 4} ${42 + i * 9} C${82 + i * 3} ${28 + i * 8}, ${89 + i * 2} ${56 + i * 8}, ${95 + i} ${43 + i * 8}`}
                fill="none"
                stroke={i % 2 === 0 ? "#2563eb" : "#0f766e"}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </g>

          <g transform="translate(153 42)">
            <rect x="0" y="0" width="68" height="17" rx="6" fill="#dbeafe" stroke="#64748b" strokeWidth="2" />
            <path d="M9 15 L59 15 L51 130 Q34 150 17 130 Z" fill="url(#tubeGlass)" stroke="#64748b" strokeWidth="2.3" />
            <path d="M17 103 L51 103 L47 130 Q34 143 21 130 Z" fill="#67e8f9" opacity="0.75" />
          </g>

          {showLabels && (
            <g fontFamily="inherit" textAnchor="middle">
              <text x="130" y="220" fontSize="17" fontWeight="800" fill="#0f172a">
                RNA خالص
              </text>
              <text x="130" y="246" fontSize="13" fill="#64748b">
                آماده برای کنترل کیفیت و ساخت کتابخانه
              </text>
            </g>
          )}
        </g>

        {/* footer note */}
        {showLabels && (
          <g fontFamily="inherit">
            <rect x="160" y="458" width="880" height="38" rx="19" fill="#0f172a" opacity="0.96" />
            <text x="600" y="483" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f8fafc">
              نمایش شماتیک آموزشی — جزئیات پروتکل استخراج RNA بسته به نوع نمونه و روش آزمایشگاهی متفاوت است.
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function RnaExtractionMiniIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <rect x="18" y="7" width="28" height="8" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
      <path d="M21 14 H43 L39 51 Q32 58 25 51 Z" fill="#ecfeff" stroke="#475569" strokeWidth="2" />
      <path d="M25 39 H39 L37 50 Q32 55 27 50 Z" fill="#67e8f9" />
      <path d="M27 32 C30 26, 33 38, 36 32 C39 27, 41 35, 42 31" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
