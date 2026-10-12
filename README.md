# Code Together – Client

React front end for Code Together, a real-time collaborative code editor.

## Stack

- React 19, React Router 7, Redux Toolkit
- Vite 8, Tailwind CSS 4, oxlint
- Monaco editor, Socket.IO client
- react-hook-form, sonner (toasts), lucide-react (icons), react-markdown

## Getting started

Requires Node.js 20.19 or newer.

```bash
npm install
cp .env.example .env.local   # then set VITE_API_URL
npm run dev                  # http://localhost:3001
```

## Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server on port 3001     |
| `npm run build`   | Build for production into `build/`    |
| `npm run preview` | Serve the production build locally    |
| `npm run lint`    | Lint the code with oxlint             |

## Environment variables

| Name           | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | URL of the Code Together server, no trailing slash. |

`REACT_APP_BASE_URL` from the old Create React App setup is still read as a fallback.
