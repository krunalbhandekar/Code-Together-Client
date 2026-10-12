import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Check, Inbox, Loader2, Mail, X } from "lucide-react";
import Drawer from "./ui/Drawer";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import EmptyState from "./ui/EmptyState";
import { fetchMyInvitations, respondToInvitation } from "../lib/invitations";

const statusTone = { Accepted: "green", Rejected: "red", Pending: "amber" };

const timeAgo = (date) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? null
    : formatDistanceToNow(parsed, { addSuffix: true });
};

const Invitation = ({ open, close, onChange = () => {} }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);
  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState(null);
  const [invitations, setInvitations] = useState([]);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const list = await fetchMyInvitations(userId);
      // Newest first
      setInvitations([...list].reverse());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const respond = async (id, status) => {
    setRespondingId(id);
    try {
      await respondToInvitation(id, status);
      toast.success(status === "Accepted" ? "Invitation accepted" : "Invitation declined");
      onChange();
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRespondingId(null);
    }
  };

  const openFile = (fileId) => {
    close();
    navigate(`/app/${fileId}`);
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Invitations"
      icon={<Mail className="size-5 text-indigo-600" />}
    >
      <div className="space-y-3 p-5">
        {loading && invitations.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-indigo-600" aria-label="Loading invitations" />
          </div>
        ) : invitations.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No invitations yet"
            description="When someone invites you to collaborate on a file, it shows up here."
          />
        ) : (
          invitations.map((invitation) => {
            const senderName = invitation.sender?.name ?? "Someone";
            const fileName = invitation.file?.name ?? "a deleted file";
            const fileId = invitation.file?._id;
            const status = invitation.status || "Pending";
            const when = timeAgo(invitation.createdAt);

            return (
              <article
                key={invitation._id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div className="flex gap-3">
                  <Avatar name={senderName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{senderName}</span>{" "}
                      invited you to collaborate on{" "}
                      <span className="font-semibold text-slate-900">{fileName}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={statusTone[status]}>{status}</Badge>
                      {when && <span className="text-xs text-slate-400">{when}</span>}
                    </div>
                  </div>
                </div>

                {status === "Pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      className="flex-1"
                      loading={respondingId === invitation._id}
                      disabled={respondingId !== null}
                      onClick={() => respond(invitation._id, "Accepted")}
                    >
                      <Check className="size-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={respondingId !== null}
                      onClick={() => respond(invitation._id, "Rejected")}
                    >
                      <X className="size-4" />
                      Decline
                    </Button>
                  </div>
                )}

                {status === "Accepted" && fileId && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() => openFile(fileId)}
                  >
                    Open file
                    <ArrowRight className="size-4" />
                  </Button>
                )}
              </article>
            );
          })
        )}
      </div>
    </Drawer>
  );
};

export default Invitation;
