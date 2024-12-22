import EmailIcon from "../assets/icons/EmailIcon";
import GeminiIcon from "../assets/icons/GeminiIcon";
import GithubIcon from "../assets/icons/GithubIcon";
import MongoDBIcon from "../assets/icons/MongoDBIcon";
import NodeIcon from "../assets/icons/NodeIcon";
import ReactIcon from "../assets/icons/ReactIcon";
import RedisIcon from "../assets/icons/RedisIcon";
import ReduxIcon from "../assets/icons/ReduxIcon";
import RenderIcon from "../assets/icons/RenderIcon";
import SocketIcon from "../assets/icons/SocketIcon";
import VercelIcon from "../assets/icons/VercelIcon";
import VsCodeIcon from "../assets/icons/VsCodeIcon";
import TailwindIcon from "../assets/icons/TailwindIcon";

const techStacks = [
  { name: "React.js", description: "Frontend", icon: <ReactIcon /> },
  {
    name: "Redux Toolkit",
    description: "State Management",
    icon: <ReduxIcon />,
  },
  { name: "Tailwind", description: "CSS", icon: <TailwindIcon /> },
  { name: "Node.js", description: "Backend", icon: <NodeIcon /> },
  { name: "MongoDB", description: "Database", icon: <MongoDBIcon /> },
  {
    name: "Socket.IO",
    description: "Real-Time Communication",
    icon: <SocketIcon />,
  },
  {
    name: "Nodemailer",
    description: "Email Notification",
    icon: <EmailIcon />,
  },
  { name: "Google Gemini", description: "AI Support", icon: <GeminiIcon /> },
  {
    name: "Redis",
    description: "Caching",
    icon: <RedisIcon />,
  },
  { name: "VS Code", description: "Code Editor", icon: <VsCodeIcon /> },
  { name: "Github", description: "Version Control", icon: <GithubIcon /> },
  { name: "Vercel", description: "Deployment", icon: <VercelIcon /> },
  { name: "Render", description: "Deployment", icon: <RenderIcon /> },
];

export default techStacks;
