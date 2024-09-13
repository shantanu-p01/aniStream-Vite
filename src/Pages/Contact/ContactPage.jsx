import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

const ContactPage = () => {
  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <main className='pt-28 p-4 min-h-fit text-white'>
      <div className='flex flex-col lg:flex-row justify-evenly items-center lg:items-start gap-8 max-w-5xl mx-auto p-6 bg-black/20 rounded-lg shadow-lg'>
        
        {/* Shantanu's Profile */}
        <div className='w-full max-w-sm bg-black/20 rounded-lg flex flex-col items-center justify-center p-6'>
          <div className="avatar">
            <div className="ring-[#ff4155] ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
              <img src="https://cdn-icons-png.freepik.com/512/4140/4140048.png" alt="Shantanu Verulkar" />
            </div>
          </div>
          <div className='mt-6 p-4 pb-0 flex flex-col items-center justify-start gap-4'>
            <div className='flex flex-col items-center text-center'>
              {/* Responsive name handling */}
              <h1 className='text-2xl font-bold break-words text-center leading-tight'>
                Shantanu Verulkar
              </h1>
              {/* Responsive email handling with ellipses */}
              <p className='text-lg font-medium text-gray-300 mt-2 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[12rem] md:max-w-[16rem]'>
                shantanu.verulkar.01@gmail.com
              </p>
            </div>
            <div className='flex gap-4'>
              <button
                className='p-2 rounded-full btn btn-ghost bg-transparent hover:bg-transparent hover:text-white/80 transition duration-300'
                onClick={() => handleSocialClick('https://www.linkedin.com/in/shantanup01')}
              >
                <FaLinkedin size="28" />
              </button>
              <button
                className='p-2 rounded-full btn btn-ghost bg-transparent hover:bg-transparent hover:text-white/80 transition duration-300'
                onClick={() => handleSocialClick('https://github.com/shantanu-p01')}
              >
                <FaGithub size="28" />
              </button>
            </div>
          </div>
        </div>

        {/* Shweta's Profile */}
        <div className='w-full max-w-sm bg-black/20 rounded-lg flex flex-col items-center justify-center p-6'>
          <div className="avatar">
            <div className="ring-[#4c5aa5] ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
              <img src="https://cdn-icons-png.flaticon.com/512/6833/6833605.png" alt="Shweta More" />
            </div>
          </div>
          <div className='mt-6 p-4 pb-0 flex flex-col items-center justify-start gap-4'>
            <div className='flex flex-col items-center text-center'>
              {/* Responsive name handling */}
              <h1 className='text-2xl font-bold break-words text-center leading-tight'>
                Shweta More
              </h1>
              {/* Responsive email handling with ellipses */}
              <p className='text-lg font-medium text-gray-300 mt-2 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[12rem] md:max-w-[16rem]'>
                shwetamore2810@gmail.com
              </p>
            </div>
            <div className='flex gap-4'>
              <button
                className='p-2 rounded-full btn btn-ghost bg-transparent hover:bg-transparent hover:text-white/80 transition duration-300'
                onClick={() => handleSocialClick('https://www.linkedin.com/in/shweta-more-929795266')}
              >
                <FaLinkedin size="28" />
              </button>
              <button
                className='p-2 rounded-full btn btn-ghost bg-transparent hover:bg-transparent hover:text-white/80 transition duration-300'
                onClick={() => handleSocialClick('https://github.com/shwetamore2810')}
              >
                <FaGithub size="28" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ContactPage;
