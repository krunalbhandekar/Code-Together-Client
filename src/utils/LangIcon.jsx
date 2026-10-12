import JavascriptIcon from "../assets/icons/JavascriptIcon";
import PythonIcon from "../assets/icons/PythonIcon";
import CppIcon from "../assets/icons/CppIcon";

export const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
];

export const languageLabel = (value) =>
  LANGUAGES.find((lang) => lang.value === value)?.label ?? value;

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
