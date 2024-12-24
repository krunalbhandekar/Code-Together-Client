import React, { useEffect, useState } from "react";
import { Drawer, message } from "antd";
import useScreen from "../customHook/useScreen";
import axios from "axios";
import { INVITATION_URL } from "../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { onLoadCollabFiles } from "../rtk/collabFiles/action";
import { useNavigate } from "react-router-dom";

const Invitation = ({ open, close }) => {
  const isSmallScreen = useScreen();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const onLoad = async () => {
    setLoading(true);
    try {
      const res = await axios.get(INVITATION_URL, {
        headers: {
          "X-API-Filters": JSON.stringify({
            receiver: [user._id],
          }),
        },
      });
      if (res.data.status === "success") {
        setInvitations(res.data.invitations);
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.error(err?.message);
    }
    setLoading(false);
  };

  const onHandleInvitation = async ({ id, status }) => {
    setLoading(true);
    try {
      const res = await axios.put(`${INVITATION_URL}/${id}`, { status });
      if (res.data.status === "success") {
        if (status === "Accepted") {
          dispatch(onLoadCollabFiles());
        }
        onLoad();
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      message.error(err?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      onLoad();
    } else {
      setInvitations([]);
    }
  }, [open]);

  return (
    <Drawer
      title="Invitations"
      loading={loading}
      open={open}
      placement="right"
      closable={false}
      width={isSmallScreen ? 300 : 500}
      onClose={close}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {invitations.map((invitation, idx) => (
          <div
            key={idx}
            className="p-2 bg-white rounded-lg shadow-md flex flex-col items-center text-sm"
            onClick={() => {
              if (invitation.status === "Accepted") {
                navigate(`/app/${invitation.file._id}`);
                close();
              }
            }}
            style={{
              cursor: invitation.status === "Accepted" ? "pointer" : "default",
            }}
          >
            <div className="mb-4 md:mb-0">
              <p className="font-medium text-gray-800">
                <b>{invitation.sender.name}</b> invited you for collaboration in
                file <b>{invitation.file.name}</b>
              </p>

              <p
                className={`mt-2 font-semibold ${
                  invitation.status === "Accepted"
                    ? "text-green-600"
                    : invitation.status === "Rejected"
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {invitation.status || "Pending"}
              </p>
            </div>

            {invitation.status === "Pending" && (
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onHandleInvitation({
                      id: invitation._id,
                      status: "Accepted",
                    })
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    onHandleInvitation({
                      id: invitation._id,
                      status: "Rejected",
                    })
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default Invitation;
