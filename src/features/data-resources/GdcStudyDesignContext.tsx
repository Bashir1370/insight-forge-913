import { createContext, useContext, type ReactNode } from "react";

import type { GdcStudyDesignConfig } from "./gdc-study-design-config";

const GdcStudyDesignContext = createContext<GdcStudyDesignConfig | null>(null);

export function GdcStudyDesignProvider({
  config,
  children,
}: {
  config: GdcStudyDesignConfig;
  children: ReactNode;
}) {
  return (
    <GdcStudyDesignContext.Provider value={config}>
      {children}
    </GdcStudyDesignContext.Provider>
  );
}

export function useGdcStudyDesignConfig() {
  return useContext(GdcStudyDesignContext);
}
