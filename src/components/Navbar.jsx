import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bell, ChevronDown, LogOut, MessageSquarePlus } from "lucide-react";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Avatar from "./ui/Avatar";
import Invitation from "./Invitation";
import { onLogout } from "../rtk/auth/action";
import { onAddMyFeedback } from "../rtk/feedbacks/action";
import { onLoadCollabFiles } from "../rtk/collabFiles/action";
import { getSocket } from "../constants/socket";
import { fetchMyInvitations } from "../lib/invitations";
import cn from "../lib/cn";

const FEEDBACK_MAX = 1000;

const FeedbackModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const submitting = useSelector((state) => state.feedbacks.submitting);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { content: "" } });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async ({ content }) => {
    try {
      await dispatch(onAddMyFeedback({ content: content.trim() })).unwrap();
      toast.success("Thanks for your feedback!");
      close();
    } catch (message) {
      toast.error(message);
    }
  };

  const length = watch("content")?.length ?? 0;

  return (
    <Modal
      open={open}
      onClose={close}
      title="Share feedback"
      description="Tell us what you like or what we could do better."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="feedback-content" className="label">
          Your feedback
        </label>
        <textarea
          id="feedback-content"
          rows={5}
          className={cn("input resize-none", errors.content && "input-error")}
          placeholder="The real-time editing is great, but..."
          {...register("content", {
            validate: (value) => value.trim().length > 0 || "Please write something first.",
            maxLength: { value: FEEDBACK_MAX, message: `Keep it under ${FEEDBACK_MAX} characters.` },
          })}
        />
        <div className="mt-1.5 flex justify-between">
          <p className="field-error">{errors.content?.message}</p>
          <p className="text-xs text-slate-400">
            {length}/{FEEDBACK_MAX}
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Send feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const UserMenu = ({ user, onLogoutClick }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 transition hover:bg-slate-100"
      >
        <Avatar name={user?.name} size="sm" />
        <ChevronDown className="size-4 text-slate-400" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={user?.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogoutClick}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ fluid = false }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    if (!userId) return;
    try {
      const invitations = await fetchMyInvitations(userId);
      setPendingCount(invitations.filter((inv) => inv.status === "Pending").length);
    } catch {
      // The badge is a hint only; errors surface when the drawer is opened.
    }
  }, [userId]);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Real-time notifications from the server.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onInvitationUpdate = ({ message }) => {
      toast.info(message);
      refreshPendingCount();
    };
    const onCollaboratorUpdate = ({ message }) => {
      toast.info(message);
    };

    socket.on("invitation-update", onInvitationUpdate);
    socket.on("collaborator-update", onCollaboratorUpdate);
    return () => {
      socket.off("invitation-update", onInvitationUpdate);
      socket.off("collaborator-update", onCollaboratorUpdate);
    };
  }, [refreshPendingCount]);

  const handleInvitationChange = () => {
    refreshPendingCount();
    dispatch(onLoadCollabFiles());
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div
        className={cn(
          "flex h-16 items-center justify-between gap-4 px-4 sm:px-6",
          fluid ? "w-full" : "mx-auto max-w-7xl lg:px-8",
        )}
      >
        <Logo to="/app" />

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Account">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFeedbackOpen(true)}
            aria-label="Share feedback"
          >
            <MessageSquarePlus className="size-4" />
            <span className="hidden sm:inline">Feedback</span>
          </Button>

          <button
            type="button"
            onClick={() => setInvitationOpen(true)}
            aria-label={
              pendingCount > 0
                ? `Invitations, ${pendingCount} pending`
                : "Invitations"
            }
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="size-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-4 font-semibold text-white ring-2 ring-white">
                {pendingCount}
              </span>
            )}
          </button>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <UserMenu user={user} onLogoutClick={() => dispatch(onLogout())} />
        </nav>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <Invitation
        open={invitationOpen}
        close={() => setInvitationOpen(false)}
        onChange={handleInvitationChange}
      />
    </header>
  );
};

export default Navbar;
