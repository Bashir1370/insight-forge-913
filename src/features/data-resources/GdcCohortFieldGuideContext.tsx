import { createContext, useContext, type ReactNode } from "react";

import {
  DEFAULT_GDC_COHORT_FIELD_GUIDE_CONFIG,
  type GdcCohortFieldGuideConfig,
} from "./gdc-cohort-field-guide-config";

const GdcCohortFieldGuideContext = createContext<GdcCohortFieldGuideConfig>(
  DEFAULT_GDC_COHORT_FIELD_GUIDE_CONFIG,
);

export function GdcCohortFieldGuideProvider({
  config,
  children,
}: {
  config: GdcCohortFieldGuideConfig;
  children: ReactNode;
}) {
  return (
    <GdcCohortFieldGuideContext.Provider value={config}>
      {children}
    </GdcCohortFieldGuideContext.Provider>
  );
}

export function useGdcCohortFieldGuideConfig() {
  return useContext(GdcCohortFieldGuideContext);
}
