import { Loader2 } from "lucide-react";
import cn from "../../lib/cn";

const variants = {
  primary:
    "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-500",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
  success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500",
  dark: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
};

const sizes = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  icon: "size-9",
  "icon-sm": "size-8",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
      "disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
    {children}
  </button>
);

export default Button;
