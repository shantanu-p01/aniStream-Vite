import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const [isLoading, setIsLoading] = useState(true); // Loader state

  // Simulate loading for 1 second when routed
  useEffect(() => {
    // Disable scrolling when loading
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';

    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 1 second
    }, 500);

    return () => {
      clearTimeout(timer); // Clean up the timer
      document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled after unmount
    };
  }, [isLoading]);

  return (
    <>
      {isLoading ? ( // Show loader while loading
      <div className="flex justify-center items-center min-h-svh">
        <span className="loading loading-dots loading-md"></span>
      </div>
      ) : (
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
      )}
    </>
  );
};

export default ErrorPage;
