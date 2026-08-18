export function RnaSeqWorkflowFigure() {
  return (
    <figure
      dir="rtl"
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
        <p className="text-xs font-bold text-teal-700">
          نمای کلی فناوری
        </p>

        <h3 className="mt-1 text-xl font-black text-slate-950">
          مسیر کلی RNA-seq
        </h3>
      </div>

      <div className="bg-white p-3 sm:p-5">
        <div className="overflow-x-auto">
          <img
            src="/images/learning/RNA-seq%20workflow.png"
            alt="نمای شماتیک مراحل RNA-seq از نمونه زیستی تا تحلیل بیوانفورماتیکی"
            className="mx-auto block h-auto w-full min-w-[920px] object-contain md:min-w-0"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <figcaption className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-6 text-slate-500 sm:px-7">
        نمای شماتیک آموزشی؛ جزئیات آزمایشگاهی و مسیر تحلیل بسته به طراحی مطالعه و پلتفرم می‌تواند متفاوت باشد.
      </figcaption>
    </figure>
  );
}
