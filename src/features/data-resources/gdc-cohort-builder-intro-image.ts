import { useEffect, useState } from "react";

const COHORT_BUILDER_IMAGE_PARTS = [
  "/images/gdc/cohort-builder-intro-b64/01.txt",
  "/images/gdc/cohort-builder-intro-b64/02.txt",
  "/images/gdc/cohort-builder-intro-b64/03.txt",
  "/images/gdc/cohort-builder-intro-b64/04.txt",
] as const;

export function useGdcCohortBuilderIntroImage(customUrl: string) {
  const [src, setSrc] = useState(customUrl);

  useEffect(() => {
    if (customUrl) {
      setSrc(customUrl);
      return;
    }

    let active = true;
    Promise.all(
      COHORT_BUILDER_IMAGE_PARTS.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(path);
        return response.text();
      }),
    )
      .then((parts) => {
        if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => {
        if (active) setSrc("");
      });

    return () => {
      active = false;
    };
  }, [customUrl]);

  return src;
}
