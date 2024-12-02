import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Dropdown } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { LOCAL_TOKEN, LOCAL_USER } from "../constants/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(LOCAL_TOKEN);
    localStorage.removeItem(LOCAL_USER);
    window.location.href = "/login";
  };

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
            <Badge dot>
              <BellOutlined className="cursor-pointer" />
            </Badge>
          </li>
          <li>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: (
                      <div className="text-sm">
                        <p className="font-medium">Krunal Bhandekar</p>
                        <p className="text-xs">krunalbhandekar10@gmail.com</p>
                      </div>
                    ),
                    disabled: true,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    label: "Log Out",
                    icon: <LogoutOutlined />,
                    onClick: logout,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["hover"]}
            >
              <span>
                <Avatar size="small" className="bg-indigo-500 cursor-pointer">
                  K
                </Avatar>
              </span>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
