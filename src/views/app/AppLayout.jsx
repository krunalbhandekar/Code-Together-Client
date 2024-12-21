import React from "react";
import Navbar from "../../components/Navbar";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300 font-sans">
      <Navbar />
    </div>
  );
};

export default AppLayout;
