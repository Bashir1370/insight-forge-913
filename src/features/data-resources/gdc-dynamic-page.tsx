import { useEffect, useState } from "react";

import { loadResourceTour } from "./resource-tour-loader";
import { GdcHomeTour } from "./gdc-home";

export function GdcDynamicPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadResourceTour("gdc").finally(() => setLoaded(true));
  }, []);

  // Until the database-driven renderer is fully migrated,
  // keep the existing UI as a safe fallback.
  if (!loaded) return null;

  return <GdcHomeTour />;
}
