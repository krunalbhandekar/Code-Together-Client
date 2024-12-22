import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Feedback from "./Feedback";
import techStacks from "../constants/techStacks";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between">
          <h1
            className="text-xl font-bold bg-green-200 text-gray-800 px-4 py-1 rounded-lg hover:cursor-pointer"
            style={{
              clipPath: "polygon(0 0, 100% 20%, 100% 100%, 0 80%)",
              backgroundColor: "rgb(167 243 208)",
            }}
            onClick={() => navigate("/app")}
          >
            Code Together
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white text-center py-16 px-8 rounded-lg shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Collaborate, Code, and Innovate Together!
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto">
              An online collaborative coding platform that empowers teams to
              create, share, and execute code effortlessly.
            </p>
            <button
              onClick={() => navigate("/app")}
              className="bg-blue-600 px-8 py-4 text-white font-semibold rounded-full hover:bg-blue-700 transform transition-all duration-300 ease-in-out shadow-lg hover:scale-105"
            >
              Explore
            </button>
          </div>
        </section>

        <section className="py-16 px-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-center rounded-xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              About Code Together
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Code Together is a collaborative coding platform where users can
              log in, create files, invite collaborators, write and execute
              code, and receive real-time notifications via email and WebSocket.
              Perfect for team projects, coding challenges, and learning
              together.
            </p>
          </div>
        </section>
        <section className="py-16 bg-white">
          <h3 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            <div className="p-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 text-center">
              <i className="fas fa-file-alt text-3xl text-white mb-4"></i>
              <h4 className="text-xl font-semibold text-white">
                Create and Share Files
              </h4>
              <p className="text-sm text-white mt-2">
                Easily create and share files with your team.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 text-center">
              <i className="fas fa-users text-3xl text-white mb-4"></i>
              <h4 className="text-xl font-semibold text-white">
                Real-Time Collaboration
              </h4>
              <p className="text-sm text-white mt-2">
                Collaborate with team members in real time.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 text-center">
              <i className="fas fa-play-circle text-3xl text-white mb-4"></i>
              <h4 className="text-xl font-semibold text-white">
                Code Execution
              </h4>
              <p className="text-sm text-white mt-2">
                Run and test your code seamlessly within the platform.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 text-center">
              <i className="fas fa-bell text-3xl text-white mb-4"></i>
              <h4 className="text-xl font-semibold text-white">
                Email & Socket Notifications
              </h4>
              <p className="text-sm text-white mt-2">
                Receive notifications for updates and changes in real time.
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <h3 className="text-3xl font-bold text-center mb-6">
            Tech Stack & Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
            {techStacks.map((tech) => (
              <div
                className="p-4 bg-white rounded-lg shadow-md text-center"
                key={tech.name}
              >
                <div className="flex justify-center mb-4">{tech.icon}</div>
                <p className="font-bold">{tech.name}</p>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>
        <Feedback />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
