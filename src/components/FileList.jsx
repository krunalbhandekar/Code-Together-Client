import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import LangIcon from "../utils/LangIcon";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import { useDispatch } from "react-redux";
import { onDeleteMyFile } from "../rtk/myFiles/action";

const FileList = (props) => {
  const { title = "File List", list = [], deleteBtn = false } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(list);

  const handleFileOpen = (fileId) => {
    navigate(`/app/${fileId}`);
  };

  const handleFileDelete = (fileName, fileId) => {
    Modal.confirm({
      title: `Do you want to delete ${fileName} file?`,
      onOk: async () => {
        await dispatch(onDeleteMyFile({ id: fileId })).unwrap();
        message.success("File has been deleted");
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filtered = list.filter((file) =>
          file?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
      } else {
        setFilteredFiles(list);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, list]);

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 max-h-[400px] overflow-y-auto">
        {filteredFiles?.map((file) => (
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
                <DeleteOutlined />
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
