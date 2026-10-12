// VITE_API_URL is the current name. REACT_APP_BASE_URL is the name used before
// the move to Vite, still read so existing deployments keep working.
const rawBaseUrl =
  import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_BASE_URL || "";

if (!rawBaseUrl) {
  console.error(
    "VITE_API_URL is not set. Add it to .env.local, for example VITE_API_URL=http://localhost:3000",
  );
}

export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");
