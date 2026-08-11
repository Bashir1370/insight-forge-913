import { glossary } from "@/lib/content";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SciTerm({ term, children }: { term: keyof typeof glossary | string; children?: React.ReactNode }) {
  const definition = glossary[term];
  if (!definition) return <>{children ?? term}</>;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dashed border-primary/60 font-semibold text-primary">
            {children ?? term}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-right text-xs leading-6">
          <span className="mb-1 block font-bold">{term}</span>
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
