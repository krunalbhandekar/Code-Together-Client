import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Send, UserPlus } from "lucide-react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import { fetchFileCollaborators, sendInvitation } from "../lib/invitations";
import cn from "../lib/cn";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Person = ({ name, email, badge }) => (
  <li className="flex items-center gap-3 py-3">
    <Avatar name={name || email} size="sm" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-900">{name || email}</p>
      {name && email && <p className="truncate text-xs text-slate-500">{email}</p>}
    </div>
    {badge}
  </li>
);

const Collaborators = ({ open = false, close = () => {}, admin = null, fileId = "" }) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const isOwner = Boolean(user?._id && admin?._id && user._id === admin._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "" } });

  const load = useCallback(async () => {
    if (!fileId) return;
    setLoading(true);
    try {
      setCollaborators(await fetchFileCollaborators(fileId));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    if (open) load();
    else reset();
  }, [open, load, reset]);

  const onInvite = async ({ email }) => {
    const receiverEmail = email.trim().toLowerCase();
    try {
      await sendInvitation(fileId, receiverEmail);
      toast.success(`Invitation sent to ${receiverEmail}`);
      reset();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Share this file"
      description="Collaborators can view and edit this file in real time."
    >
      {isOwner && (
        <form onSubmit={handleSubmit(onInvite)} noValidate className="mb-6">
          <label htmlFor="invite-email" className="label">
            Invite by email
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <UserPlus className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="invite-email"
                type="email"
                placeholder="teammate@example.com"
                autoComplete="off"
                className={cn("input pl-9", errors.email && "input-error")}
                {...register("email", {
                  required: "Enter an email address.",
                  pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
                  validate: (value) =>
                    value.trim().toLowerCase() !== user?.email?.toLowerCase() ||
                    "You already own this file.",
                })}
              />
            </div>
            <Button type="submit" loading={isSubmitting}>
              {!isSubmitting && <Send className="size-4" />}
              Invite
            </Button>
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </form>
      )}

      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        People with access
      </h3>
      <ul className="mt-1 max-h-72 divide-y divide-slate-100 overflow-y-auto">
        {admin && (
          <Person
            name={admin.name}
            email={admin.email}
            badge={<Badge tone="indigo">Owner</Badge>}
          />
        )}
        {collaborators.map((invitation) => (
          <Person
            key={invitation._id}
            name={invitation.receiver?.name}
            email={invitation.receiver?.email ?? invitation.receiverEmail}
            badge={<Badge>Editor</Badge>}
          />
        ))}
      </ul>
      {loading && collaborators.length === 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-indigo-600" aria-label="Loading collaborators" />
        </div>
      )}
      {!loading && collaborators.length === 0 && (
        <p className="py-3 text-sm text-slate-500">
          {isOwner
            ? "No collaborators yet. Invite someone above to code together."
            : "No other collaborators yet."}
        </p>
      )}
    </Modal>
  );
};

export default Collaborators;
