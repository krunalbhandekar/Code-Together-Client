import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-center py-2 text-white">
      <p>
        &copy; {new Date().getFullYear()} Code Together. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
