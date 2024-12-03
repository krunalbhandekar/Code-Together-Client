import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { message } from "antd";
import axios from "axios";
import LangIcon from "../utils/LangIcon";
import { FILE_URL } from "../constants/api";
import useScreen from "../customHook/useScreen";
import { getSocket } from "../constants/socket";
import CODE_EDITOR from "../constants/code-editor";
import customDebounce from "../utils/customDebounce";

const CodeEditor = () => {
  const { fileId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isSmallScreen = useScreen();
  const socket = getSocket();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [code, setCode] = useState(null);
  const [language, setLanguage] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [theme, setTheme] = useState(CODE_EDITOR.THEME.DARK);
  const [result, setResult] = useState([]);
  const [resultLoading, setResultLoading] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [editorWidth, setEditorWidth] = useState(70); // Editor occupies 70% initially
  const isDragging = useRef(null);
  const debounceTimer = useRef(null);

  const onLoadFile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${FILE_URL}/${fileId}`);
      if (res.data.status === "success") {
        const file = res.data.file;
        setFileName(file.name);
        setCode(file.content);
        setLanguage(file.language);
        setAdmin(file.createdBy);
      } else {
        message.error(res.data.error);
        navigate("/");
      }
    } catch (err) {
      message.error(err?.message);
      navigate("/");
    }
    setLoading(false);
  };

  const debounce = (callback, delay) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      callback();
    }, delay);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (event) => {
      if (!isDragging.current) return;
      const newWidth = (event.clientX / window.innerWidth) * 100; // Convert pixel to percentage
      if (newWidth > 20 && newWidth < 80) {
        debounce(() => setEditorWidth(newWidth), 50); // Debounce the state update
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    debounceEmit(newCode);
  };

  const debounceEmit = useRef(
    customDebounce((newCode) => {
      socket.emit("update-file", { fileId, content: newCode });
    }, 1500)
  ).current;

  const handleCodeRun = () => {
    setResultLoading(true);
    setResult([]);
    setResultLoading(false);
  };

  useEffect(() => {
    onLoadFile();
  }, [fileId, location]);

  const editorStyle = !isSmallScreen
    ? { flexBasis: `${editorWidth}%`, maxWidth: `${editorWidth}%` }
    : {};
  const resultStyle = !isSmallScreen
    ? { flexBasis: `${100 - editorWidth}%`, maxWidth: `${100 - editorWidth}%` }
    : {};

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-wrap items-center justify-between pt-0 pl-4 pr-4 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <LangIcon lang={language} />
          <h2 className="font-semibold text-lg">{fileName}</h2>
        </div>

        {!isSmallScreen && (
          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
              className="border rounded p-2"
            >
              <option value={CODE_EDITOR.THEME.DARK}>Dark</option>
              <option value={CODE_EDITOR.THEME.LIGHT}>Light</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="border rounded p-2"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row flex-grow h-[90vh] overflow-hidden">
        <div
          style={{ ...editorStyle, overflow: "auto" }}
          className="h-full border-b sm:border-b-0 sm:border-r border-gray-300"
        >
          <MonacoEditor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            options={{
              minimap: { enabled: false },
              padding: { top: 10, bottom: 10 },
              roundedSelection: true,
              fontSize: fontSize,
            }}
            onChange={handleCodeChange}
          />
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="hidden sm:block w-1 bg-gray-300 cursor-col-resize"
        />

        <div style={resultStyle} className="h-full bg-gray-100 overflow-auto">
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Result</h2>
            <button
              disabled={loading}
              onClick={handleCodeRun}
              className="relative flex items-center justify-center bg-green-500 text-white rounded px-4 py-1 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resultLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              )}
              Run
            </button>
          </div>
          <div className="p-4">
            {result.length > 0
              ? result?.map((item, index) => (
                  <div key={index} className="mb-2">
                    {/* Replace \n with <br /> to render line breaks */}
                    <p>
                      {item.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {/* Add a <br /> tag after each line except the last one */}
                          {i < item.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
