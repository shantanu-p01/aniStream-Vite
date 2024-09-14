import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div className="error-page flex pt-28 flex-col items-center justify-center min-h-svh text-center p-6">
      <div className="error-content bg-black/20 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-white/80 mb-6">Oops! Page not found.</p>
        <p className="text-white/70 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="text-blue-500 w-full justify-center hover:text-blue-400 duration-300 flex items-center">
          <FaHome className="mr-2" /> Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
