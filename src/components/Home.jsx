import React, { useState } from "react";
import FileList from "./FileList";

const Home = () => {
  const [form, setForm] = useState({ name: "", language: "" });
  const [loading, setLoading] = useState(false);
  const myFiles = [];
  const collabFiles = [];

  const handleCreateFile = () => {};

  return (
    <div>
      <div className="mb-6 px-4 py-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800">Create New File</h2>
        <form onSubmit={handleCreateFile}>
          <div className="flex flex-wrap items-center mt-4 gap-4">
            <input
              value={form.name}
              type="text"
              placeholder="File Name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 min-w-[200px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <select
              value={form.language}
              required
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="min-w-[150px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="" disabled selected>
                Select Language
              </option>
              <option value="go">Go</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="ruby">Ruby</option>
            </select>
            <button
              disabled={loading}
              className="relative flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              )}
              Create File
            </button>
          </div>
        </form>
      </div>

      {myFiles && myFiles.length > 0 && (
        <FileList title="My Files" list={myFiles} deleteBtn={true} />
      )}

      {collabFiles && collabFiles.length > 0 && (
        <FileList title="Collaborative Files" list={collabFiles} />
      )}
    </div>
  );
};

export default Home;
