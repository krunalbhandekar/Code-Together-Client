import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import MonacoEditor from "@monaco-editor/react";
import {
  ArrowLeft,
  Check,
  CloudOff,
  Eraser,
  Loader2,
  Minus,
  Moon,
  Play,
  Plus,
  Sparkles,
  Sun,
  Terminal,
  Users,
} from "lucide-react";
import LangIcon, { languageLabel } from "../utils/LangIcon";
import customDebounce from "../utils/customDebounce";
import { getSocket } from "../constants/socket";
import { request } from "../lib/api";
import Button from "./ui/Button";
import Collaborators from "./Collaborators";
import AskGemini from "./AskGemini";
import cn from "../lib/cn";

const LS_THEME = "ct-theme";
const LIGHT = "vs-light";
const DARK = "vs-dark";
const MIN_FONT = 10;
const MAX_FONT = 32;
const FONT_STEP = 2;
const RUN_TIMEOUT_MS = 20000;

const readTheme = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_THEME)) === LIGHT ? LIGHT : DARK;
  } catch {
    return DARK;
  }
};

const SyncStatus = ({ connected, saving }) => {
  if (!connected) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <CloudOff className="size-3.5" />
        Offline
        <span className="hidden sm:inline">· changes will sync when reconnected</span>
      </span>
    );
  }
  if (saving) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <Check className="size-3.5 text-emerald-600" />
      Saved
    </span>
  );
};

const IconButton = ({ label, className, ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "flex size-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40",
      className,
    )}
    {...props}
  />
);

const CodeEditor = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [loadedFileId, setLoadedFileId] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState(readTheme);
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(() => getSocket()?.connected ?? false);
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);
  const [askAiOpen, setAskAiOpen] = useState(false);
  const debounceEmitRef = useRef(null);

  // Edits are only sent once this file's content is in the editor, so they
  // can never be saved into another file.
  const isFileReady = loadedFileId === fileId;

  // Load the file whenever the route changes.
  useEffect(() => {
    let cancelled = false;
    setLoadedFileId(null);
    setOutput([]);

    request({ url: `/file/${fileId}` })
      .then((data) => {
        if (cancelled) return;
        setFile(data.file);
        setContent(data.file.content ?? "");
        setLoadedFileId(fileId);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err.message);
        navigate("/app", { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [fileId, navigate]);

  // One debounced sender per file, bound to that file's id. On file switch or
  // unmount, any pending edit is flushed to the file it was typed in.
  // Declared before the socket effect so this cleanup runs before "file-close".
  useEffect(() => {
    const debounced = customDebounce((newCode) => {
      getSocket()?.emit("update-file", { fileId, content: newCode });
      setSaving(false);
    }, 1000);
    debounceEmitRef.current = debounced;

    return () => {
      debounced.flush();
      if (debounceEmitRef.current === debounced) debounceEmitRef.current = null;
    };
  }, [fileId]);

  // Join the file's live room and listen for collaborators' changes.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const joinRoom = () => {
      setConnected(true);
      socket.emit("file-open", { fileId });
    };
    const onDisconnect = () => setConnected(false);
    const onFileUpdated = ({ id, content: remote }) => {
      if (String(id) === fileId) setContent(remote);
    };
    const onExecutionResult = ({ result }) => {
      setOutput((prev) => [...prev, result]);
      setRunning(false);
    };
    const onUserJoined = ({ result }) => toast.success(result);
    const onUserLeft = ({ result }) => toast.info(result);
    const onFileError = ({ result }) => toast.error(result);

    // "connect" also fires after a reconnect, which re-joins the room.
    socket.on("connect", joinRoom);
    socket.on("disconnect", onDisconnect);
    socket.on("file-updated", onFileUpdated);
    socket.on("execution-result", onExecutionResult);
    socket.on("new-user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("file-error", onFileError);
    if (socket.connected) joinRoom();

    return () => {
      socket.emit("file-close", { fileId });
      socket.off("connect", joinRoom);
      socket.off("disconnect", onDisconnect);
      socket.off("file-updated", onFileUpdated);
      socket.off("execution-result", onExecutionResult);
      socket.off("new-user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("file-error", onFileError);
    };
  }, [fileId]);

  // The server doesn't signal the end of a run, so stop the spinner after a while.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setRunning(false), RUN_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [running]);

  const handleCodeChange = (value = "") => {
    setContent(value);
    if (isFileReady && debounceEmitRef.current) {
      setSaving(true);
      debounceEmitRef.current(value);
    }
  };

  const handleRun = useCallback(() => {
    const socket = getSocket();
    if (!socket?.connected) {
      toast.error("You're offline. Reconnect to run code.");
      return;
    }
    setOutput([]);
    setRunning(true);
    socket.emit("execute-code", { language: file?.language, content });
  }, [file?.language, content]);

  // Ctrl/Cmd + Enter runs the code.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isFileReady && !running) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun, isFileReady, running]);

  const toggleTheme = () => {
    const next = theme === LIGHT ? DARK : LIGHT;
    localStorage.setItem(LS_THEME, JSON.stringify(next));
    setTheme(next);
  };

  const isDark = theme === DARK;
  const outputText = output
    .map((chunk) => (chunk.endsWith("\n") ? chunk : `${chunk}\n`))
    .join("");

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1">
          <Link
            to="/app"
            aria-label="Back to files"
            title="Back to files"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200">
            {file && <LangIcon lang={file.language} />}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {isFileReady ? file?.name : "Loading…"}
            </h1>
            <div className="flex items-center gap-2">
              {file && (
                <span className="text-xs text-slate-500">{languageLabel(file.language)}</span>
              )}
              {isFileReady && (
                <>
                  <span className="text-slate-300">·</span>
                  <SyncStatus connected={connected} saving={saving} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <IconButton
              label={isDark ? "Switch to light editor theme" : "Switch to dark editor theme"}
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </IconButton>
            <span className="mx-0.5 h-5 w-px bg-slate-200" />
            <IconButton
              label="Decrease font size"
              disabled={fontSize <= MIN_FONT}
              onClick={() => setFontSize((size) => Math.max(MIN_FONT, size - FONT_STEP))}
            >
              <Minus className="size-4" />
            </IconButton>
            <span className="w-7 text-center text-xs font-medium text-slate-600 tabular-nums" aria-label={`Font size ${fontSize}`}>
              {fontSize}
            </span>
            <IconButton
              label="Increase font size"
              disabled={fontSize >= MAX_FONT}
              onClick={() => setFontSize((size) => Math.min(MAX_FONT, size + FONT_STEP))}
            >
              <Plus className="size-4" />
            </IconButton>
          </div>

          <Button variant="secondary" size="sm" onClick={() => setCollaboratorOpen(true)} aria-label="Collaborators">
            <Users className="size-4" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAskAiOpen(true)}
            aria-label="Ask AI"
            className="text-violet-700"
          >
            <Sparkles className="size-4" />
            <span className="hidden md:inline">Ask AI</span>
          </Button>
          <Button
            variant="success"
            size="sm"
            className="ml-auto sm:ml-0"
            onClick={handleRun}
            disabled={!isFileReady}
            loading={running}
            title="Run (Ctrl/Cmd + Enter)"
          >
            {!running && <Play className="size-4 fill-current" />}
            {running ? "Running…" : "Run"}
          </Button>
        </div>
      </div>

      {/* Editor and output */}
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,32%)] lg:grid-rows-1">
        <div className={cn("relative min-h-0", isDark ? "bg-[#1e1e1e]" : "bg-white")}>
          {!isFileReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Loader2 className="size-6 animate-spin text-indigo-500" aria-label="Loading file" />
            </div>
          )}
          <MonacoEditor
            height="100%"
            language={file?.language}
            theme={theme}
            value={content}
            loading={<Loader2 className="size-6 animate-spin text-indigo-500" aria-label="Loading editor" />}
            options={{
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              fontSize,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontLigatures: true,
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: !isFileReady,
            }}
            onChange={handleCodeChange}
          />
        </div>

        <section
          aria-label="Output"
          className={cn(
            "flex min-h-0 flex-col border-t lg:border-t-0 lg:border-l",
            isDark ? "border-slate-800 bg-slate-950 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between border-b px-4 py-2",
              isDark ? "border-slate-800" : "border-slate-200",
            )}
          >
            <h2 className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase opacity-70">
              <Terminal className="size-4" />
              Output
            </h2>
            {output.length > 0 && (
              <button
                type="button"
                onClick={() => setOutput([])}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs opacity-70 transition hover:opacity-100"
              >
                <Eraser className="size-3.5" />
                Clear
              </button>
            )}
          </div>
          <pre
            aria-live="polite"
            className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap"
          >
            {outputText || (
              <span className="opacity-50">
                {running ? "Running…" : "Run your code to see the output here."}
              </span>
            )}
          </pre>
        </section>
      </div>

      <Collaborators
        open={collaboratorOpen}
        close={() => setCollaboratorOpen(false)}
        admin={file?.createdBy}
        fileId={fileId}
      />
      <AskGemini open={askAiOpen} close={() => setAskAiOpen(false)} fileId={fileId} />
    </div>
  );
};

export default CodeEditor;
