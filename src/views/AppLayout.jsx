import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <main className="flex-grow px-4 sm:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6 w-full">
          <Outlet />
        </div>
      </main>
      <footer className="bg-indigo-300 border-t border-gray-300 text-center py-2 text-white">
        <p>
          &copy; {new Date().getFullYear()} Code Together. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
