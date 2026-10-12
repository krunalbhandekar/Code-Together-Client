import { CheckCircle2 } from "lucide-react";
import Logo from "../../components/ui/Logo";

const POINTS = [
  "Edit code together in real time",
  "Run JavaScript, Python and C++ in the browser",
  "Get help from a built-in AI assistant",
];

const YEAR = new Date().getFullYear();

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-dvh lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.3),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <Logo light className="relative" />
      <div className="relative max-w-md">
        <h2 className="text-3xl font-bold tracking-tight">
          Where teams write code together.
        </h2>
        <ul className="mt-8 space-y-4">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="size-5 shrink-0 text-indigo-400" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-sm text-slate-500">
        &copy; {YEAR} Code Together
      </p>
    </aside>

    <main className="flex items-center justify-center bg-white px-4 py-12 sm:px-8">
      <div className="w-full max-w-sm">
        <Logo className="mb-10 lg:hidden" />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;
