import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { FileCode2, SearchX, Trash2 } from "lucide-react";
import LangIcon, { languageLabel } from "../utils/LangIcon";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import { onDeleteMyFile } from "../rtk/myFiles/action";

const createdAgo = (date) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? null
    : `Created ${formatDistanceToNow(parsed, { addSuffix: true })}`;
};

const FileCard = ({ file, onDelete }) => (
  <li className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <span className="flex size-10 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200">
        <LangIcon lang={file.language} />
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(file)}
          aria-label={`Delete ${file.name}`}
          className="relative z-10 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:text-rose-600"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
    <h3 className="mt-3 truncate font-semibold text-slate-900">
      {/* The link covers the whole card; the delete button sits above it. */}
      <Link
        to={`/app/${file._id}`}
        className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none group-focus-within:text-indigo-600"
      >
        {file.name || "Untitled"}
      </Link>
    </h3>
    <p className="mt-1 text-xs text-slate-500">
      {languageLabel(file.language)}
      {createdAgo(file.createdAt) && <> · {createdAgo(file.createdAt)}</>}
    </p>
  </li>
);

const SkeletonGrid = () => (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
    {Array.from({ length: 4 }, (_, i) => (
      <li key={i} className="h-[124px] animate-pulse rounded-xl border border-slate-200 bg-white p-4">
        <div className="size-10 rounded-lg bg-slate-100" />
        <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
      </li>
    ))}
  </ul>
);

const FileList = ({
  title,
  icon: Icon = FileCode2,
  files,
  total,
  loading,
  searching,
  emptyTitle,
  emptyDescription,
  canDelete = false,
}) => {
  const dispatch = useDispatch();
  const deletingId = useSelector((state) => state.myFiles.deletingId);
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    try {
      await dispatch(onDeleteMyFile({ id: toDelete._id })).unwrap();
      toast.success(`Deleted ${toDelete.name}`);
      setToDelete(null);
    } catch (message) {
      toast.error(message);
    }
  };

  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-slate-400" />
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {!loading && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {total}
          </span>
        )}
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : files.length === 0 ? (
        searching && total > 0 ? (
          <EmptyState icon={SearchX} title="No matching files" description="Try a different search term." />
        ) : (
          <EmptyState icon={Icon} title={emptyTitle} description={emptyDescription} />
        )
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onDelete={canDelete ? setToDelete : undefined}
            />
          ))}
        </ul>
      )}

      {canDelete && (
        <Modal
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          title="Delete file?"
          size="sm"
        >
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{toDelete?.name}</span> will be
            permanently deleted for you and every collaborator. This can't be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deletingId === toDelete?._id}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default FileList;
