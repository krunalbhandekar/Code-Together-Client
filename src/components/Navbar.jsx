import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellOutlined,
  LogoutOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, message, Modal, Tooltip } from "antd";
import { startCase } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { onLogout } from "../rtk/auth/slice";
import { onAddMyFeedback } from "../rtk/feedbacks/action";
import Invitation from "./Invitation";
import { getSocket } from "../constants/socket";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();
  const { user } = useSelector((state) => state.auth);
  const { loading: feedbackLoading, error } = useSelector(
    (state) => state.feedbacks
  );
  const [addFeedback, setAddFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [invitationOpen, setInvitationOpen] = useState(false);

  const onAddFeedback = async (e) => {
    e.preventDefault();
    dispatch(onAddMyFeedback({ content: feedbackContent }));
    if (!error) {
      message.success("Feedback Added");
      setFeedbackContent("");
      setAddFeedback(false);
    } else {
      message.error(error);
    }
  };

  const handleLogout = () => {
    dispatch(onLogout());
  };

  useEffect(() => {
    socket.on("invitation-update", ({ message: msg }) => {
      message.success(msg);
    });
    socket.on("collaborator-update", ({ message: msg }) => {
      message.success(msg);
    });
  }, []);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between">
        <h1
          className="text-xl font-bold text-gray-800 bg-green-200 px-4 py-1 rounded-lg hover:cursor-pointer"
          style={{
            clipPath: "polygon(0 0, 100% 20%, 100% 100%, 0 80%)",
            backgroundColor: "rgb(167 243 208)",
          }}
          onClick={() => navigate("/")}
        >
          Code Together
        </h1>

        <ul className="flex items-center space-x-4">
          <li>
            <Tooltip title="Add Feedback">
              <SolutionOutlined
                onClick={() => setAddFeedback(true)}
                className="cursor-pointer"
              />
            </Tooltip>
          </li>
          <li>
            <Tooltip title="Invitations">
              <BellOutlined
                onClick={() => setInvitationOpen(true)}
                className="cursor-pointer"
              />
            </Tooltip>
          </li>
          <li>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: (
                      <div className="text-sm cursor-default">
                        <p className="font-medium">{user?.name || "User"}</p>
                        <p className="text-xs">{user?.email || "Email"}</p>
                      </div>
                    ),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    label: "Log Out",
                    icon: <LogoutOutlined />,
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["hover"]}
            >
              <span>
                <Avatar size="small" className="bg-indigo-500 cursor-pointer">
                  {user?.name ? startCase(user.name[0]) : "U"}
                </Avatar>
              </span>
            </Dropdown>
          </li>
        </ul>
      </div>
      <Modal
        title="Add Feedback"
        open={addFeedback}
        onCancel={() => {
          setAddFeedback(false);
          setFeedbackContent("");
        }}
        footer={null}
        closable={true}
        maskClosable={false}
        loading={feedbackLoading}
      >
        <form className="mb-5 shadow p-3 rounded-lg" onSubmit={onAddFeedback}>
          <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
            <textarea
              value={feedbackContent}
              placeholder="Add your feedback"
              required
              onChange={(e) => setFeedbackContent(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              disabled={feedbackLoading}
              className="relative flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 desabled:opacity-50 disabled:cursor-not-allowed"
            >
              {feedbackLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-4 border-transparent border-white rounded-full animate-spin"></div>
                </div>
              )}
              Add
            </button>
          </div>
        </form>
      </Modal>
      <Invitation
        open={invitationOpen}
        close={() => setInvitationOpen(false)}
      />
    </header>
  );
};

export default Navbar;
