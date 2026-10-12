import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  FileCode2,
  MonitorPlay,
  Palette,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import Logo from "./ui/Logo";
import Footer from "./Footer";
import Feedback from "./Feedback";
import techStacks from "../constants/techStacks";

const FEATURES = [
  {
    icon: FileCode2,
    title: "Create and share files",
    text: "Spin up a JavaScript, Python or C++ file in seconds and share it with anyone by email.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    text: "Every keystroke syncs to your teammates instantly, so you're always looking at the same code.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MonitorPlay,
    title: "Run code in the browser",
    text: "Execute your code and see the output right next to the editor. No setup required.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Sparkles,
    title: "AI assistant",
    text: "Ask Google Gemini for explanations, examples and debugging help without leaving the editor.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Bell,
    title: "Instant notifications",
    text: "Get notified by email and in the app when you're invited or someone joins your file.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Palette,
    title: "Comfortable editor",
    text: "The same editor that powers VS Code, with light and dark themes and adjustable font size.",
    color: "bg-sky-50 text-sky-600",
  },
];

const STEPS = [
  { icon: FileCode2, title: "Create a file", text: "Pick a name and a language." },
  { icon: UserPlus, title: "Invite your team", text: "Send an invite to their email." },
  { icon: MonitorPlay, title: "Code and run", text: "Edit together and run it live." },
];

const CODE_LINES = [
  [["text-violet-400", "function "], ["text-sky-300", "twoSum"], ["text-slate-300", "(nums, target) {"]],
  [["text-violet-400", "  const "], ["text-slate-300", "seen = "], ["text-violet-400", "new "], ["text-amber-300", "Map"], ["text-slate-300", "();"]],
  [["text-violet-400", "  for "], ["text-slate-300", "(let i = 0; i < nums.length; i++) {"]],
  [["text-violet-400", "    const "], ["text-slate-300", "need = target - nums[i];"]],
  [["text-violet-400", "    if "], ["text-slate-300", "(seen.has(need)) "], ["text-violet-400", "return "], ["text-slate-300", "[seen.get(need), i];"]],
  [["text-slate-300", "    seen.set(nums[i], i);"]],
  [["text-slate-300", "  }"]],
  [["text-slate-300", "}"]],
];

const EditorPreview = () => (
  <div className="relative mx-auto mt-16 max-w-4xl">
    <div aria-hidden="true" className="absolute -inset-4 rounded-3xl bg-linear-to-r from-indigo-500/30 via-violet-500/30 to-sky-500/30 blur-2xl" />
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-rose-400/80" />
          <span className="size-3 rounded-full bg-amber-400/80" />
          <span className="size-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-slate-400">two-sum.js</span>
        </div>
        <div className="flex -space-x-2">
          {["bg-indigo-500", "bg-emerald-500", "bg-amber-500"].map((color, i) => (
            <span key={color} className={`flex size-6 items-center justify-center rounded-full ${color} text-[10px] font-semibold text-white ring-2 ring-slate-900`}>
              {["KB", "AN", "PS"][i]}
            </span>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[1fr_240px]">
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
          {CODE_LINES.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-5 w-4 text-right text-slate-600 select-none">{i + 1}</span>
              <span>
                {line.map(([cls, text], j) => (
                  <span key={j} className={cls}>{text}</span>
                ))}
                {i === 3 && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-emerald-400" />}
              </span>
            </div>
          ))}
        </pre>
        <div className="border-t border-slate-800 bg-slate-950 p-5 font-mono text-[13px] md:border-t-0 md:border-l">
          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Output</p>
          <p className="text-emerald-400">[ 0, 1 ]</p>
          <p className="mt-4 text-xs text-slate-500">Finished in 42 ms</p>
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const primaryTo = isAuthenticated ? "/app" : "/signup";
  const primaryLabel = isAuthenticated ? "Open your workspace" : "Start coding for free";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Main">
            <a href="#features" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 md:block">
              Features
            </a>
            <a href="#feedback" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 md:block">
              Feedback
            </a>
            {isAuthenticated ? (
              <Link to="/app" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
                Open app
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/signup" className="inline-flex h-9 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 lg:px-8">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%)]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(226_232_240/0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgb(226_232_240/0.6)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)] bg-size-[56px_56px]" />
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <Sparkles className="size-3.5" />
              Real-time editing, code execution and AI help
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Write code together,{" "}
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
                in real time.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Code Together is a collaborative code editor for pair programming, interviews and
              learning. Share a file, see every change live and run it in your browser.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={primaryTo} className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500">
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              <a href="#features" className="inline-flex h-12 items-center rounded-xl px-6 font-semibold text-slate-700 ring-1 ring-slate-300 transition ring-inset hover:bg-slate-50">
                See features
              </a>
            </div>
          </div>
          <EditorPreview />
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-t border-slate-100 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to code as a team
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text, color }) => (
                <div key={title} className="card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className={`flex size-11 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From idea to running code in three steps
              </h2>
            </div>
            <ol className="mt-14 grid gap-8 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="text-center">
                  <span className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                    <Icon className="size-6" />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold ring-4 ring-white">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tech stack */}
        <section className="border-t border-slate-100 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600">Under the hood</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Tech stack and tools
              </h2>
            </div>
            <ul className="mt-14 flex flex-wrap justify-center gap-4">
              {techStacks.map((tech) => (
                <li
                  key={tech.name}
                  className="card flex w-[calc(50%-8px)] flex-col items-center p-5 text-center sm:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)]"
                >
                  <div className="flex h-12 items-center justify-center">{tech.icon}</div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{tech.name}</p>
                  <p className="text-xs text-slate-500">{tech.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Feedback />

        {/* Call to action */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-xl sm:px-16">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.4),transparent_60%)]" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to code together?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
              Create a free account and invite your first teammate in under a minute.
            </p>
            <Link to={primaryTo} className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-slate-900 transition hover:bg-slate-100">
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
