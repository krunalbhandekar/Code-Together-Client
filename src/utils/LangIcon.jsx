import React from "react";
import JavascriptIcon from "../assets/icons/JavascriptIcon";
import PythonIcon from "../assets/icons/PythonIcon";

const LangIcon = ({ lang }) => {
  switch (lang) {
    case "javascript":
      return <JavascriptIcon />;
    case "python":
      return <PythonIcon />;
    default:
      return null;
  }
};

export default LangIcon;
