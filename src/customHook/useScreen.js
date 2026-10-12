import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 640px)";

const subscribe = (callback) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

// True on screens 640px wide or narrower.
const useScreen = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches);

export default useScreen;
