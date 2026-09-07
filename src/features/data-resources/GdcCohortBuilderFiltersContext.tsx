import { createContext, useContext, type ReactNode } from "react";

import {
  DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG,
  type GdcCohortBuilderFiltersConfig,
} from "./gdc-cohort-builder-filters-config";

const GdcCohortBuilderFiltersContext = createContext<GdcCohortBuilderFiltersConfig>(
  DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG,
);

export function GdcCohortBuilderFiltersProvider({
  config,
  children,
}: {
  config: GdcCohortBuilderFiltersConfig;
  children: ReactNode;
}) {
  return (
    <GdcCohortBuilderFiltersContext.Provider value={config}>
      {children}
    </GdcCohortBuilderFiltersContext.Provider>
  );
}

export function useGdcCohortBuilderFiltersConfig() {
  return useContext(GdcCohortBuilderFiltersContext);
}
