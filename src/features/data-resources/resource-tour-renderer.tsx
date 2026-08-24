import { GdcHomeTour } from "./gdc-home";
import { DatabaseResourceTour } from "./database-resource-tour";

type ResourceTourRendererProps = {
  resource: {
    slug?: string;
    image_url?: string | null;
    hotspots?: unknown[];
    content?: unknown[];
  } | null;
};

/**
 * Generic renderer entry point for database-driven resource tours.
 */
export function ResourceTourRenderer({ resource }: ResourceTourRendererProps) {
  if (!resource) return <GdcHomeTour />;

  if (resource.hotspots || resource.content || resource.image_url) {
    return <DatabaseResourceTour resource={resource} />;
  }

  return <GdcHomeTour />;
}
