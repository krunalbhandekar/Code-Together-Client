import React from "react";
import { FaJava } from "react-icons/fa";
import { DiRuby } from "react-icons/di";
import { FaGolang, FaPython } from "react-icons/fa6";
import { MdOutlineJavascript } from "react-icons/md";

const LangIcon = ({ lang }) => {
  switch (lang) {
    case "javascript":
      return (
        <MdOutlineJavascript className="bg-yellow-200 rounded text-black" />
      );
    case "java":
      return <FaJava />;
    case "go":
      return <FaGolang />;
    case "python":
      return <FaPython />;
    case "ruby":
      return <DiRuby />;
    default:
      return null;
  }
};

export default LangIcon;
