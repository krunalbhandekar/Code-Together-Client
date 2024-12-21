import React from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { format } from "date-fns";
import LangIcon from "../utils/LangIcon";

const FileList = (props) => {
  const { title = "File List", list = [], deleteBtn = false } = props;
  const navigate = useNavigate();

  const handleFileOpen = (fileId) => {
    navigate(`/${fileId}`);
  };

  const handleFileDelete = (fileName, fileId) => {
    console.log(fileName, fileId);
  };

  return (
    <div className="mb-6 px-4 py-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
          {title}
        </h2>
        <input
          type="text"
          placeholder="Search files..."
          className="border rounded-lg px-4 py-2 text-gray-700 w-full md:w-auto"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 max-h-[400px] overflow-y-auto">
        {list?.map((file) => (
          <div
            key={file?._id}
            className="group p-5 border rounded-lg bg-gray-50 relative cursor-pointer hover:shadow-md transition"
            onClick={() => handleFileOpen(file?._id)}
          >
            <h3 className="text-sm font-bold text-gray-700">{file?.name}</h3>
            <p className="text-xs text-gray-500 mb-4">
              {`Created At: ${format(
                new Date(file?.createdAt),
                "dd MMM yyyy"
              )}`}
            </p>
            {deleteBtn && (
              <button
                className="absolute top-2 right-2 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileDelete(file?.name, file?._id);
                }}
              >
                <RiDeleteBin6Line />
              </button>
            )}
            <button className="absolute bottom-2 left-2 text-gray-500">
              <LangIcon lang={file?.language} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
