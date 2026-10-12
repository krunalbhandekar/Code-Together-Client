import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FilePlus2, FolderOpen, Search, Users } from "lucide-react";
import FileList from "./FileList";
import Button from "./ui/Button";
import { onAddMyFile } from "../rtk/myFiles/action";
import { LANGUAGES } from "../utils/LangIcon";
import cn from "../lib/cn";

const CreateFileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creating = useSelector((state) => state.myFiles.creating);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", language: "javascript" } });

  const onSubmit = async ({ name, language }) => {
    try {
      const file = await dispatch(onAddMyFile({ name: name.trim(), language })).unwrap();
      toast.success(`Created ${file.name}`);
      reset();
      navigate(`/app/${file._id}`);
    } catch (message) {
      toast.error(message);
    }
  };

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="create-file-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FilePlus2 className="size-5" />
        </span>
        <div>
          <h2 id="create-file-title" className="font-semibold text-slate-900">
            Create a new file
          </h2>
          <p className="text-sm text-slate-500">Pick a name and a language to start coding.</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <label htmlFor="file-name" className="sr-only">
            File name
          </label>
          <input
            id="file-name"
            placeholder="e.g. two-sum"
            autoComplete="off"
            className={cn("input", errors.name && "input-error")}
            {...register("name", {
              validate: (value) => value.trim().length > 0 || "Enter a file name.",
              maxLength: { value: 60, message: "Use 60 characters or fewer." },
            })}
          />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div className="sm:w-44">
          <label htmlFor="file-language" className="sr-only">
            Language
          </label>
          <select id="file-language" className="input" {...register("language")}>
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" loading={creating} className="h-[42px]">
          Create file
        </Button>
      </form>
    </section>
  );
};

const matches = (file, term) =>
  (file?.name ?? "").toLowerCase().includes(term.trim().toLowerCase());

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const myFilesState = useSelector((state) => state.myFiles);
  const collabState = useSelector((state) => state.collabFiles);
  const [search, setSearch] = useState("");

  const myFiles = useMemo(
    () => myFilesState.myFiles.filter((file) => matches(file, search)),
    [myFilesState.myFiles, search],
  );
  const collabFiles = useMemo(
    () => collabState.collabFiles.filter((file) => matches(file, search)),
    [collabState.collabFiles, search],
  );

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-1 text-slate-500">
            Create a file or pick up where you left off.
          </p>
        </div>
        <div className="relative sm:w-72">
          <label htmlFor="file-search" className="sr-only">
            Search files
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="file-search"
            type="search"
            placeholder="Search files"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      <CreateFileForm />

      <FileList
        title="My files"
        icon={FolderOpen}
        files={myFiles}
        total={myFilesState.myFiles.length}
        loading={myFilesState.loading && !myFilesState.loaded}
        searching={Boolean(search.trim())}
        emptyTitle="No files yet"
        emptyDescription="Create your first file above to start coding."
        canDelete
      />

      <FileList
        title="Shared with me"
        icon={Users}
        files={collabFiles}
        total={collabState.collabFiles.length}
        loading={collabState.loading && !collabState.loaded}
        searching={Boolean(search.trim())}
        emptyTitle="Nothing shared with you yet"
        emptyDescription="Files appear here when you accept an invitation to collaborate."
      />
    </div>
  );
};

export default Home;
