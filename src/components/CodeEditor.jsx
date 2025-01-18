import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message, Tooltip } from "antd";
import axios from "axios";
import { FILE_URL } from "../constants/api";
import useScreen from "../customHook/useScreen";
import LangIcon from "../utils/LangIcon";
import {
  SunOutlined,
  MoonFilled,
  UsergroupAddOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import MonacoEditor from "@monaco-editor/react";
import customDebounce from "../utils/customDebounce";
import { getSocket } from "../constants/socket";
import Collaborators from "./Collaborators";
import AskGemini from "./AskGemini";

const lightTheme = "vs-light";
const darkTheme = "vs-dark";
const minFontSize = 10;
const editorWidth = 70;

const CodeEditor = () => {
  const { fileId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isSmallScreen = useScreen();
  const socket = getSocket();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [content, setContent] = useState(null);
  const [language, setLanguage] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [fontSize, setFontSize] = useState(minFontSize);
  const [theme, setTheme] = useState(darkTheme);
  const [result, setResult] = useState([]);
  const [resultLoading, setResultLoading] = useState(false);
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);
  const [askGeminiOpen, setAskGeminiOpen] = useState(false);

  const onLoadFile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${FILE_URL}/${fileId}`);
      if (res.data.status === "success") {
        const file = res.data.file;
        setFileName(file.name);
        setContent(file.content);
        setLanguage(file.language);
        setAdmin(file.createdBy);
      } else {
        message.error(res.data.error);
        navigate("/app");
      }
    } catch (err) {
      message.error(err?.message);
      navigate("/app");
    }
    setLoading(false);
  };

  const handleCodeChange = (newCode) => {
    setContent(newCode);
    debounceEmit(newCode);
  };

  const debounceEmit = useRef(
    customDebounce((newCode) => {
      socket.emit("update-file", { fileId, content: newCode });
    }, 1200)
  ).current;

  const handleCodeRun = () => {
    setResultLoading(true);
    setResult([]);
    socket.emit("execute-code", { language, content });
  };

  useEffect(() => {
    onLoadFile();

    if (location.pathname.includes(fileId)) {
      socket.emit("file-open", { fileId });
    }

    const handleFileUpdated = ({ id, content }) => {
      if (id === fileId) {
        setContent(content);
      }
    };

    const handleExecutionResult = ({ result }) => {
      setResult((prev) => [...prev, result]);
      setResultLoading(false);
    };

    const handleNewUserJoined = ({ result }) => {
      message.success(result);
    };

    const handleUserLeft = ({ result }) => {
      message.error(result);
    };

    const handleFileError = ({ result }) => {
      message.error(result);
    };

    socket.on("file-updated", handleFileUpdated);
    socket.on("execution-result", handleExecutionResult);
    socket.on("new-user-joined", handleNewUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("file-error", handleFileError);

    return () => {
      socket.emit("file-close", { fileId });

      socket.off("file-updated", handleFileUpdated);
      socket.off("execution-result", handleExecutionResult);
      socket.off("new-user-joined", handleNewUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("file-error", handleFileError);
    };
  }, [fileId, location]);

  const editorStyle = !isSmallScreen
    ? { flexBasis: `${editorWidth}%`, maxWidth: `${editorWidth}%` }
    : {};
  const resultStyle = !isSmallScreen
    ? {
        flexBasis: `${100 - editorWidth}%`,
        maxWidth: `${100 - editorWidth}%`,
      }
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
            <button
              onClick={() =>
                setTheme(theme === lightTheme ? darkTheme : lightTheme)
              }
            >
              {theme === lightTheme ? <MoonFilled /> : <SunOutlined />}
            </button>
            <div className="flex space-x-4">
              <button
                disabled={fontSize === minFontSize}
                onClick={() => setFontSize((prev) => prev - 5)}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xl font-bold shadow-md transition-transform transform active:scale-90 
      ${
        fontSize === minFontSize
          ? "bg-gray-300 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
              >
                <MinusOutlined style={{ fontSize: 12 }} />
              </button>
              <button
                onClick={() => setFontSize((prev) => prev + 5)}
                className="flex items-center justify-center w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold shadow-md transition-transform transform active:scale-90"
              >
                <PlusOutlined style={{ fontSize: 12 }} />
              </button>
            </div>
          </div>
        )}

        {!isSmallScreen && (
          <Tooltip title="Collaborators">
            <button
              size="small"
              onClick={() => setCollaboratorOpen(true)}
              className="bg-red-500 px-2 rounded-lg text-white hover:bg-red-600"
            >
              <UsergroupAddOutlined />
            </button>
          </Tooltip>
        )}

        <Tooltip title="Ask to AI">
          <button
            onClick={() => setAskGeminiOpen(!askGeminiOpen)}
            className="bg-blue-500 text-white px-2 py-1 rounded-full "
          >
            AI
          </button>
        </Tooltip>
        <button
          disabled={loading}
          onClick={() => handleCodeRun()}
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

      <div className="flex flex-col sm:flex-row flex-grow h-[90vh] overflow-hidden gap-4 sm:gap-0">
        <div
          style={{ ...editorStyle, overflow: "auto" }}
          className="h-full sm:h-full sm:border-b-0 sm:border-r border-b border-gray-300"
        >
          <MonacoEditor
            height="100%"
            language={language}
            theme={theme}
            value={content}
            options={{
              minimap: { enabled: false },
              padding: { top: 30, bottom: 10 },
              roundedSelection: true,
              fontSize: fontSize,
            }}
            onChange={handleCodeChange}
          />
        </div>

        <div
          style={resultStyle}
          className="h-1/2 sm:h-full bg-gray-100 sm:max-w-full"
        >
          <MonacoEditor
            height="100%"
            language="text"
            theme={theme}
            value={result.join("\n")}
            options={{
              minimap: { enabled: false },
              padding: { top: 30, bottom: 10 },
              roundedSelection: true,
              fontSize: 10,
              lineNumbers: "off",
            }}
          />
        </div>
      </div>
      <Collaborators
        open={collaboratorOpen}
        close={() => setCollaboratorOpen(false)}
        admin={admin}
        fileId={fileId}
      />
      <AskGemini
        open={askGeminiOpen}
        close={() => setAskGeminiOpen(false)}
        fileId={fileId}
      />
    </div>
  );
};

export default CodeEditor;
