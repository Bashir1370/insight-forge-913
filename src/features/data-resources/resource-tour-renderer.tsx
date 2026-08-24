import { GdcHomeTour } from "./gdc-home";

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
 * GDC keeps the current visual experience while migrating data sources.
 * New resources can plug into this renderer without creating new routes.
 */
export function ResourceTourRenderer({ resource }: ResourceTourRendererProps) {
  if (!resource) return <GdcHomeTour />;

  switch (resource.slug) {
    case "gdc":
    default:
      return <GdcHomeTour />;
  }
}
