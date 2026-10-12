import { Link } from "react-router-dom";
import { CodeXml } from "lucide-react";
import cn from "../../lib/cn";

const Logo = ({ to = "/", className, light = false }) => (
  <Link
    to={to}
    className={cn("inline-flex items-center gap-2.5 rounded-lg", className)}
    aria-label="Code Together home"
  >
    <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
      <CodeXml className="size-5" strokeWidth={2.5} />
    </span>
    <span
      className={cn(
        "text-lg font-bold tracking-tight",
        light ? "text-white" : "text-slate-900",
      )}
    >
      Code Together
    </span>
  </Link>
);

export default Logo;
