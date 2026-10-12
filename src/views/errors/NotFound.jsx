import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../../components/ui/Logo";

const NotFound = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <Logo className="mb-10" />
    <p className="text-sm font-semibold text-indigo-600">404</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
      Page not found
    </h1>
    <p className="mt-3 max-w-md text-slate-600">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
    >
      <ArrowLeft className="size-4" />
      Back to home
    </Link>
  </div>
);

export default NotFound;
