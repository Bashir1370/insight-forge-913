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
      label?: string;
    }>;
  };
};

export function DatabaseResourceTour({ resource }: DatabaseResourceTourProps) {
  const hotspots = resource.hotspots ?? [];
  const title = resource.content?.find((item) => item.key === "title")?.value;
  const description = resource.content?.find((item) => item.key === "description")?.value;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm" dir="rtl">
      <div className="mb-4">
        {title ? <h1 className="text-2xl font-black">{title}</h1> : null}
        {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      </div>

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
            title={hotspot.title ?? hotspot.label}
            className="absolute rounded-md border-2 border-teal-500 bg-teal-400/20"
            style={{
              left: `${hotspot.x ?? 0}%`,
              top: `${hotspot.y ?? 0}%`,
              width: `${hotspot.width ?? 10}%`,
              height: `${hotspot.height ?? 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
