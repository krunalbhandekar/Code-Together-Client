export const LOCAL_TOKEN = "ct-token";
export const LOCAL_USER = "ct-user";

export const AUTH_USER = await JSON.parse(localStorage.getItem(LOCAL_USER));

export const getAuthUserId = () => {
  return AUTH_USER ? AUTH_USER?._id : null;
};

export const getAuthUserName = () => {
  return AUTH_USER ? AUTH_USER?.name : null;
};

export const getAuthUserEmail = () => {
  return AUTH_USER ? AUTH_USER?.email : null;
};
