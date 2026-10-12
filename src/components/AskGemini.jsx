import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { ArrowUp, Check, Copy, Loader2, Sparkles, Trash2 } from "lucide-react";
import Drawer from "./ui/Drawer";
import Button from "./ui/Button";
import { request } from "../lib/api";
import cn from "../lib/cn";

const SUGGESTIONS = [
  "How do I reverse a linked list?",
  "Explain Big-O notation with examples",
  "What's the difference between let, const and var?",
];

const CodeBlock = ({ children }) => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard.");
    }
  };

  return (
    <div className="group relative">
      <pre
        ref={ref}
        className="overflow-x-auto rounded-lg bg-slate-900 p-4 pr-12 font-mono text-[13px] leading-relaxed text-slate-100"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 rounded-md bg-slate-800 p-1.5 text-slate-300 transition hover:bg-slate-700 hover:text-white"
      >
        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
};

const markdownComponents = {
  pre: CodeBlock,
  a: ({ children, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ),
};

const Answer = ({ text }) => (
  <div className="prose-ai text-sm leading-relaxed text-slate-700">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {text}
    </ReactMarkdown>
  </div>
);

const UserBubble = ({ text }) => (
  <div className="flex justify-end">
    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm whitespace-pre-wrap text-white">
      {text}
    </p>
  </div>
);

const AiBubble = ({ children }) => (
  <div className="flex gap-3">
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
      <Sparkles className="size-4" />
    </span>
    <div className="min-w-0 flex-1 pt-0.5">{children}</div>
  </div>
);

const AskGemini = ({ open, close, fileId }) => {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [prompt, setPrompt] = useState("");

  const loadHistory = useCallback(async () => {
    const data = await request({
      url: "/gemini",
      headers: { "X-API-Filters": JSON.stringify({ file: [fileId] }) },
    });
    setHistory(data.gemini ?? []);
  }, [fileId]);

  useEffect(() => {
    if (!open) return;
    setLoadingHistory(true);
    loadHistory()
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingHistory(false));
  }, [open, loadHistory]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current?.closest(".overflow-y-auto");
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, pendingPrompt]);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || pendingPrompt) return;
    setPendingPrompt(question);
    setPrompt("");
    try {
      await request({ method: "post", url: "/gemini", data: { prompt: question, file: fileId } });
      await loadHistory();
    } catch (err) {
      toast.error(err.message);
      setPrompt(question);
    } finally {
      setPendingPrompt(null);
      inputRef.current?.focus();
    }
  };

  const clearHistory = async () => {
    setClearing(true);
    try {
      await request({ method: "delete", url: `/gemini/${fileId}` });
      setHistory([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setClearing(false);
    }
  };

  const isEmpty = history.length === 0 && !pendingPrompt;

  return (
    <Drawer
      open={open}
      onClose={close}
      title="AI assistant"
      icon={<Sparkles className="size-5 text-violet-600" />}
      actions={
        history.length > 0 && (
          <Button variant="ghost" size="sm" loading={clearing} onClick={clearHistory}>
            {!clearing && <Trash2 className="size-4" />}
            Clear
          </Button>
        )
      }
      footer={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(prompt);
          }}
          className="p-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white p-2 shadow-xs focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15">
            <label htmlFor="ai-prompt" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="ai-prompt"
              ref={inputRef}
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(prompt);
                }
              }}
              placeholder="Ask anything about code…"
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-400"
            />
            <Button
              type="submit"
              size="icon-sm"
              aria-label="Send"
              disabled={!prompt.trim() || Boolean(pendingPrompt)}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      }
    >
      <div ref={scrollRef} className="space-y-6 p-5">
        {loadingHistory && history.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-violet-600" aria-label="Loading conversation" />
          </div>
        ) : isEmpty ? (
          <div className="py-8 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Sparkles className="size-6" />
            </span>
            <p className="mt-4 font-semibold text-slate-900">How can I help?</p>
            <p className="mt-1 text-sm text-slate-500">
              Ask for explanations, examples or help debugging.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {history.map((item) => (
              <div key={item._id} className="space-y-4">
                <UserBubble text={item.prompt} />
                <AiBubble>
                  <Answer text={item.response} />
                </AiBubble>
              </div>
            ))}
            {pendingPrompt && (
              <div className="space-y-4">
                <UserBubble text={pendingPrompt} />
                <AiBubble>
                  <p className={cn("flex items-center gap-2 text-sm text-slate-500")}>
                    <Loader2 className="size-4 animate-spin" />
                    Thinking…
                  </p>
                </AiBubble>
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default AskGemini;
