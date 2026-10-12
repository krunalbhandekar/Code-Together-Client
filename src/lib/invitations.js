import { request } from "./api";

export const fetchMyInvitations = async (userId) => {
  const data = await request({
    url: "/invitation",
    headers: { "X-API-Filters": JSON.stringify({ receiver: [userId] }) },
  });
  return data.invitations ?? [];
};

export const fetchFileCollaborators = async (fileId) => {
  const data = await request({
    url: "/invitation",
    headers: {
      "X-API-Filters": JSON.stringify({ file: [fileId], status: ["Accepted"] }),
    },
  });
  return (data.invitations ?? []).filter((inv) => inv.status === "Accepted");
};

export const respondToInvitation = (id, status) =>
  request({ method: "put", url: `/invitation/${id}`, data: { status } });

export const sendInvitation = (fileId, receiverEmail) =>
  request({ method: "post", url: "/invitation", data: { fileId, receiverEmail } });
