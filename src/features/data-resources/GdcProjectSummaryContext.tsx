import { createContext, useContext, type ReactNode } from "react";

import {
  DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
  type GdcProjectSummaryConfig,
} from "./gdc-project-summary-config";

const GdcProjectSummaryContext = createContext<GdcProjectSummaryConfig>(
  DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
);

export function GdcProjectSummaryProvider({
  config,
  children,
}: {
  config: GdcProjectSummaryConfig;
  children: ReactNode;
}) {
  return (
    <GdcProjectSummaryContext.Provider value={config}>
      {children}
    </GdcProjectSummaryContext.Provider>
  );
}

export function useGdcProjectSummaryConfig() {
  return useContext(GdcProjectSummaryContext);
}
