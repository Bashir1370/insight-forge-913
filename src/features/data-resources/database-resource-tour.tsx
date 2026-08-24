type DatabaseResourceTourProps = {
  resource: {
    image_url?: string | null;
    hotspots?: Array<{
      id?: string;
      title?: string;
      label?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    }>;
    content?: Array<{
      key?: string;
      value?: string;
    }>;
  };
};

export function DatabaseResourceTour({ resource }: DatabaseResourceTourProps) {
  const hotspots = resource.hotspots ?? [];

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-slate-50">
        {resource.image_url ? (
          <img
            src={resource.image_url}
            alt="Resource tour"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : null}

        {hotspots.map((hotspot, index) => (
          <div
            key={hotspot.id ?? index}
            className="absolute rounded-md border-2 border-teal-500 bg-teal-400/20"
            style={{
              left: `${(hotspot.x ?? 0) * 100}%`,
              top: `${(hotspot.y ?? 0) * 100}%`,
              width: `${(hotspot.width ?? 0.1) * 100}%`,
              height: `${(hotspot.height ?? 0.1) * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {(resource.content ?? []).map((item, index) => (
          <div key={item.key ?? index} className="rounded-lg bg-slate-50 p-3 text-sm">
            <strong>{item.key}</strong>: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
