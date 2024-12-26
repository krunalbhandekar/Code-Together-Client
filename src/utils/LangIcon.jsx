import React from "react";
import JavascriptIcon from "../assets/icons/JavascriptIcon";
import PythonIcon from "../assets/icons/PythonIcon";
import CppIcon from "../assets/icons/CppIcon";

const LangIcon = ({ lang }) => {
  switch (lang) {
    case "javascript":
      return <JavascriptIcon />;
    case "python":
      return <PythonIcon />;
    case "cpp":
      return <CppIcon />;
    default:
      return null;
  }
};

export default LangIcon;
