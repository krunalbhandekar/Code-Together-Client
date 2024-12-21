import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AvatarStatus from "../utils/AvatarStatus";
import axios from "axios";
import { INVITATION_URL } from "../constants/api";

const Collaborators = ({
  open = false,
  close = () => {},
  admin = null,
  fileId = "",
}) => {
  const { user } = useSelector((state) => state.auth);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  const onLoad = async () => {
    setInviteLoading(true);
    try {
      const res = await axios.get(INVITATION_URL, {
        headers: {
          "X-API-Filters": JSON.stringify({ file: [fileId] }),
        },
      });
      if (res.data.status === "success") {
        setCollaborators(res.data.invitations);
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.error(err?.message);
    }
    setInviteLoading(false);
  };

  const sendInvitation = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const res = await axios.post(`${INVITATION_URL}`, {
        fileId,
        receiverEmail,
      });
      if (res.data.status === "success") {
        onLoad();
        message.success(`Invitation has been sent to ${receiverEmail}`);
        setReceiverEmail("");
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.err(err?.message);
    }
    setInviteLoading(false);
  };

  useEffect(() => {
    if (open) {
      onLoad();
    } else {
      setCollaborators([]);
      setReceiverEmail("");
    }
  }, [open]);

  return (
    <Modal
      title="Collaborators"
      open={open}
      onCancel={close}
      footer={null}
      closable={true}
      maskClosable={false}
    >
      {user?._id === admin?._id && (
        <form className="mb-5 shadow p-3 rounded-lg" onSubmit={sendInvitation}>
          <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
            <input
              value={receiverEmail}
              type="email"
              placeholder="Enter email address"
              required
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              disabled={inviteLoading}
              className="relative flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 desabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inviteLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-4 border-transparent border-white rounded-full animate-spin"></div>
                </div>
              )}
              Invite
            </button>
          </div>
        </form>
      )}
      <div className="max-h-[300px] shadow overflow-y-auto p-3 rounded-lg">
        <AvatarStatus
          name={admin?.name ?? ""}
          subTitle={admin?.email ?? ""}
          suffix="Admin"
        />
        {collaborators?.map((e) => (
          <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
            <AvatarStatus
              name={e?.reveiver?.name ?? e?.receiverEmail}
              subTitle={e?.reveiver?.email ?? e?.receiverEmail}
            />
            <p
              className={`text-white px-4 rounded-lg ${
                e?.status === "Accepted"
                  ? "bg-green-500"
                  : e?.status === "Pending"
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
            >
              {e?.status === "Accepted" ? "Joined" : e?.status}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Collaborators;
