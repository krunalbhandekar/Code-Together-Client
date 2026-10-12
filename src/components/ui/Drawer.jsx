import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// Side panel on the right, built on the native <dialog> element.
const Drawer = ({ open, onClose, title, icon, actions, children, footer }) => {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // Backdrop clicks close the dialog; keyboard users close it with Escape.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby={titleId}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-white p-0 text-slate-900 shadow-2xl sm:max-w-lg"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2
              id={titleId}
              className="flex items-center gap-2 text-base font-semibold text-slate-900"
            >
              {icon}
              {title}
            </h2>
            <div className="flex items-center gap-2">
              {actions}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="border-t border-slate-200">{footer}</div>}
        </div>
      )}
    </dialog>
  );
};

export default Drawer;
