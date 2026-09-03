import type { ComponentProps } from "react";

import { GdcQuestionDrivenGuideV5 } from "./GdcQuestionDrivenGuideV5";

type Props = ComponentProps<typeof GdcQuestionDrivenGuideV5>;

export function GdcQuestionDrivenGuideV6(props: Props) {
  return (
    <div className="gdc-guide-v6">
      <style>{`
        .gdc-guide-v6 .fixed.inset-0 > section {
          width: min(96vw, 1500px) !important;
          max-width: 1500px !important;
          max-height: 96vh !important;
        }

        @media (min-width: 1024px) {
          .gdc-guide-v6 .fixed.inset-0 > section {
            grid-template-columns: 500px minmax(0, 1fr) !important;
          }
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:first-of-type {
          padding: 16px !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:first-of-type img {
          width: 100% !important;
          height: auto !important;
          display: block !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type {
          padding: 20px 24px !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type > .mt-6 {
          margin-top: 16px !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type .space-y-4 > :not([hidden]) ~ :not([hidden]) {
          margin-top: 12px !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type [class*="rounded-2xl border p-5"] {
          padding: 16px !important;
        }

        .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type p.leading-7 {
          line-height: 1.75rem !important;
        }

        @media (max-width: 1023px) {
          .gdc-guide-v6 .fixed.inset-0 {
            padding: 8px !important;
          }

          .gdc-guide-v6 .fixed.inset-0 > section {
            width: 98vw !important;
            max-height: 98vh !important;
          }
        }
      `}</style>
      <GdcQuestionDrivenGuideV5 {...props} />
    </div>
  );
}
