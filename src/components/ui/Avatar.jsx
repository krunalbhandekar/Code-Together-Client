import cn from "../../lib/cn";

const palette = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

const colorFor = (text = "") => {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
};

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-12 text-base" };

const Avatar = ({ name = "", size = "md", className }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
      colorFor(name),
      sizes[size],
      className,
    )}
  >
    {initialsOf(name)}
  </span>
);

export default Avatar;
