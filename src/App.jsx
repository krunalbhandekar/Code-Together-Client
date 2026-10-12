import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";
import Landing from "./components/Landing";
import Home from "./components/Home";
import ServerWakeup from "./components/ServerWakeup";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";
import NotFound from "./views/errors/NotFound";
import { onLoadMyFiles } from "./rtk/myFiles/action";
import { onLoadCollabFiles } from "./rtk/collabFiles/action";

// The editor pulls in Monaco, so it is loaded only when a file is opened.
const CodeEditor = lazy(() => import("./components/CodeEditor"));

const PageLoader = () => (
  <div className="flex h-full min-h-[50vh] items-center justify-center">
    <Loader2 className="size-6 animate-spin text-indigo-600" aria-label="Loading" />
  </div>
);

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestOnly = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/app" replace /> : children;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(onLoadMyFiles())
      .unwrap()
      .catch((message) => toast.error(message));
    dispatch(onLoadCollabFiles())
      .unwrap()
      .catch((message) => toast.error(message));
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <ServerWakeup />
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <Signup />
            </GuestOnly>
          }
        />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route
            path=":fileId"
            element={
              <Suspense fallback={<PageLoader />}>
                <CodeEditor />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
