import { Outlet, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import cn from "../../lib/cn";

const AppLayout = () => {
  const { fileId } = useParams();
  const isEditor = Boolean(fileId);

  return (
    <div className={cn("flex flex-col bg-slate-50", isEditor ? "h-dvh" : "min-h-dvh")}>
      <Navbar fluid={isEditor} />
      <main
        className={cn(
          isEditor
            ? "min-h-0 flex-1"
            : "mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8",
        )}
      >
        <Outlet />
      </main>
      {!isEditor && <Footer />}
    </div>
  );
};

export default AppLayout;
