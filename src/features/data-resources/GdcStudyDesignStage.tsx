import { GdcStudyDesignStageManaged } from "./GdcStudyDesignStageManaged";
import { useGdcStudyDesignConfig } from "./GdcStudyDesignContext";
import { DEFAULT_GDC_STUDY_DESIGN } from "./gdc-study-design-config";

export function GdcStudyDesignStage({
  title,
  stageNumber,
  stageTotal,
  onPrevious,
  onNext,
}: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const managedConfig = useGdcStudyDesignConfig();

  return (
    <GdcStudyDesignStageManaged
      title={title}
      stageNumber={stageNumber}
      stageTotal={stageTotal}
      config={managedConfig ?? DEFAULT_GDC_STUDY_DESIGN}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
}
