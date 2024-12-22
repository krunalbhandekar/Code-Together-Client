import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-center py-4 text-white">
      <p>
        &copy; {new Date().getFullYear()} Code Together. By - Krunal Bhandekar
      </p>
    </footer>
  );
};

export default Footer;
