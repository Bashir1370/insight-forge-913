type DatabaseResourceTourProps = {
  resource: {
    image_url?: string | null;
    hotspots?: unknown[];
    content?: unknown[];
  };
};

/**
 * Database driven resource tour renderer foundation.
 * Keeps the page independent from hard-coded catalog data.
 */
export function DatabaseResourceTour({ resource }: DatabaseResourceTourProps) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-xl font-black">Database Resource Tour</h2>
      <p className="mt-2 text-sm text-slate-500">
        This resource is loaded from Supabase and is ready for visual blocks.
      </p>
      <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-white">
        {JSON.stringify(resource, null, 2)}
      </pre>
    </div>
  );
}
