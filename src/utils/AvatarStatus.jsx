import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "antd";
import { startCase } from "lodash";

const renderAvatar = (_props) => {
  const props = Object.assign({}, _props);

  props.text = _props.name ? _props.name.split("")[0] : "";

  return (
    <Avatar
      {...props}
      style={{ backgroundColor: "#e5e9f2", color: "#8392a5" }}
      className={`ant-avatar-${props.type}`}
    >
      {startCase(props.text)}
    </Avatar>
  );
};

export const AvatarStatus = (props) => {
  const {
    name,
    suffix,
    subTitle,
    id,
    type,
    icon,
    size,
    shape,
    gap,
    text,
    fontSize = 14,
    onNameClick,
  } = props;

  return (
    <div className="flex items-center space-x-3">
      <div>{renderAvatar({ name, icon, type, size, shape, gap, text })}</div>
      <div>
        <div className="flex items-center space-x-1">
          {onNameClick ? (
            <div
              onClick={() => onNameClick({ name, subTitle, id })}
              className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer"
              style={{ fontSize }}
            >
              {name}
            </div>
          ) : (
            <div className="font-medium text-gray-800" style={{ fontSize }}>
              {name}
            </div>
          )}
          {suffix && (
            <span className="text-xs bg-green-300 text-white rounded-lg px-4">
              {suffix}
            </span>
          )}
        </div>
        {subTitle && (
          <span className="text-sm text-gray-400 font-medium">{subTitle}</span>
        )}
      </div>
    </div>
  );
};

AvatarStatus.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  onNameClick: PropTypes.func,
};

export default AvatarStatus;
