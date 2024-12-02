import React from "react";
import { FaJava } from "react-icons/fa";
import { DiRuby } from "react-icons/di";
import { FaGolang, FaPython } from "react-icons/fa6";
import { RiJavascriptFill } from "react-icons/ri";

const LangIcon = ({ lang }) => {
  switch (lang) {
    case "javascript":
      return <RiJavascriptFill />;
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
