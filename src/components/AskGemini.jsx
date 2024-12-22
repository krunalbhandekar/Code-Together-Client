import React, { useEffect, useRef, useState } from "react";
import { Drawer, message } from "antd";
import useScreen from "../customHook/useScreen";
import { GEMINI_URL } from "../constants/api";
import axios from "axios";

const AskGemini = ({ open, close, fileId }) => {
  const isSmallScreen = useScreen();
  const containerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [prompt, setPrompt] = useState("");

  const onLoad = async () => {
    setLoading(true);
    try {
      const res = await axios.get(GEMINI_URL, {
        headers: {
          "X-API-Filters": JSON.stringify({ file: [fileId] }),
        },
      });
      if (res.data.status === "success") {
        setResponse(res.data.gemini);
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.error(err?.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(GEMINI_URL, { prompt, file: fileId });
      if (res.data.status === "success") {
        onLoad();
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.error(err?.message);
    }
    setLoading(false);
    setResponse([]);
    setPrompt("");
  };

  useEffect(() => {
    // Scroll to the last element whenever the response array changes
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [response]);

  useEffect(() => {
    if (open) {
      onLoad();
    } else {
      setResponse([]);
    }
  }, [open]);

  return (
    <Drawer
      title="Code Together AI"
      loading={loading}
      open={open}
      placement="right"
      closable={false}
      width={isSmallScreen ? 300 : 500}
      onClose={close}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto space-y-2" ref={containerRef}>
          {response?.map((res) => (
            <div key={res._id}>
              <div className="border p-2 rounded-lg bg-gray-500 text-white">
                <p>{res.prompt}</p>
              </div>
              <GeminiUi text={res.response} />
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="pt-4 sticky bottom-0 bg-white border-t border-gray-200 flex items-center space-x-2"
        >
          <textarea
            type="text"
            value={prompt}
            required
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-2 border rounded-lg shadow-sm"
            placeholder="Enter your prompt"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-500 text-white rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </Drawer>
  );
};

const GeminiUi = ({ text = "" }) => {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const parseInlineHeadings = (text) => {
    const parts = text.split(/(\\.?\\)/); // Split by *...**
    return parts?.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <strong key={index} className="text-gray-800 font-semibold">
            {part.replace(/\\/g, "")}
          </strong>
        );
      }
      return part; // Regular text
    });
  };

  // Function to parse the input text into structured parts
  const parseContent = (input) => {
    const lines = input.split("\n"); // Split by line breaks
    const content = [];
    let currentCode = null;

    lines.forEach((line) => {
      line = line.trim();

      if (line.startsWith("* ")) {
        // Bullet point with possible inline heading
        content.push({
          type: "bullet",
          value: parseInlineHeadings(line.slice(2)),
        });
      } else if (line.startsWith("```")) {
        // Code block start/end
        if (currentCode) {
          content.push({ type: "code", value: currentCode.trim() });
          currentCode = null;
        } else {
          currentCode = "";
        }
      } else if (currentCode !== null) {
        // Inside code block
        currentCode += line + "\n";
      } else if (line) {
        // Plain text with possible inline heading
        content.push({ type: "text", value: parseInlineHeadings(line) });
      }
    });

    return content;
  };

  const parsedContent = parseContent(text);

  return (
    <div className="p-6 space-y-4">
      {parsedContent?.map((item, index) => {
        if (item.type === "bullet") {
          return (
            <li key={index} className="text-gray-700 list-disc ml-6">
              {item.value}
            </li>
          );
        } else if (item.type === "code") {
          return (
            <div
              key={index}
              className="relative bg-gray-800 text-white p-4 rounded shadow-lg overflow-x-auto"
            >
              <button
                onClick={() => copyToClipboard(item.value)}
                className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition"
              >
                Copy code
              </button>
              <pre className="whitespace-pre-wrap">{item.value}</pre>
            </div>
          );
        } else if (item.type === "text") {
          return (
            <p key={index} className="text-gray-700">
              {item.value}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};

export default AskGemini;
