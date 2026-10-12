import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import cn from "../../lib/cn";

const PasswordInput = ({ id, invalid, ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("input pr-10", invalid && "input-error")}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-slate-600"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
