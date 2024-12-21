import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Feedback from "../../components/Feedback";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300 font-sans">
      <Navbar />
      <main className="flex-grow px-4 sm:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6 w-full">
          <Outlet />
        </div>
      </main>
      <Feedback />
      <Footer />
    </div>
  );
};

export default AppLayout;
