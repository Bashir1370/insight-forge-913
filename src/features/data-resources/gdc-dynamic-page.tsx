import { useEffect, useState } from "react";

import { loadResourceTour } from "./resource-tour-loader";
import { ResourceTourRenderer } from "./resource-tour-renderer";

type ResourceTourData = Awaited<ReturnType<typeof loadResourceTour>>;

export function GdcDynamicPage() {
  const [resource, setResource] = useState<ResourceTourData>(null);

  useEffect(() => {
    loadResourceTour("gdc").then(setResource);
  }, []);

  return <ResourceTourRenderer resource={resource} />;
}
