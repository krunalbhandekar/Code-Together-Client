import React from "react";
import { FaPython } from "react-icons/fa6";
import { MdOutlineJavascript } from "react-icons/md";

const LangIcon = ({ lang }) => {
  switch (lang) {
    case "javascript":
      return (
        <MdOutlineJavascript className="bg-yellow-200 rounded text-black" />
      );
    case "python":
      return <FaPython />;
    default:
      return null;
  }
};

export default LangIcon;
