import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Avatar from "./ui/Avatar";
import { onLoadFeedbacks } from "../rtk/feedbacks/action";

const Feedback = () => {
  const dispatch = useDispatch();
  const scrollerRef = useRef(null);
  const { feedbacks, loaded, error } = useSelector((state) => state.feedbacks);

  useEffect(() => {
    if (!loaded) dispatch(onLoadFeedbacks());
  }, [loaded, dispatch]);

  const scrollBy = (direction) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  // Hide the section when there's nothing to show, rather than an error.
  if (error || (loaded && feedbacks.length === 0)) return null;

  return (
    <section id="feedback" className="scroll-mt-16 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Feedback</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What developers are saying
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous feedback"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next feedback"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {!loaded
            ? Array.from({ length: 3 }, (_, i) => (
                <li
                  key={i}
                  aria-hidden="true"
                  className="h-56 w-[85%] shrink-0 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                />
              ))
            : feedbacks.map((feedback) => (
                <li
                  key={feedback._id}
                  className="card flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <Quote className="size-6 text-indigo-200" aria-hidden="true" />
                  <p className="mt-4 line-clamp-6 flex-1 text-sm leading-relaxed text-slate-700">
                    {feedback.content}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <Avatar name={feedback.createdBy?.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {feedback.createdBy?.name ?? "Anonymous"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {feedback.createdBy?.designation}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
};

export default Feedback;
