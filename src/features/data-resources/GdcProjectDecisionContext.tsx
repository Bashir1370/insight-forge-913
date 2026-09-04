import { createContext, useContext, type ReactNode } from "react";

import {
  DEFAULT_GDC_PROJECT_DECISION_CONFIG,
  type GdcProjectDecisionConfig,
} from "./gdc-project-decision-config";

const GdcProjectDecisionContext = createContext<GdcProjectDecisionConfig>(
  DEFAULT_GDC_PROJECT_DECISION_CONFIG,
);

export function GdcProjectDecisionProvider({
  config,
  children,
}: {
  config: GdcProjectDecisionConfig;
  children: ReactNode;
}) {
  return (
    <GdcProjectDecisionContext.Provider value={config}>
      {children}
    </GdcProjectDecisionContext.Provider>
  );
}

export function useGdcProjectDecisionConfig() {
  return useContext(GdcProjectDecisionContext);
}
