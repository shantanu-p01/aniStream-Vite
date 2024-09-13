import React from 'react';

const Footer = () => {
  return (
    <footer className='w-full mt-10 bg-black/20 text-white py-8'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6'>
        {/* Left section */}
        <div className='text-center md:text-left'>
          <h1 className='text-3xl'>
            <span className='text-blue-500 font-bold'>ani</span>Stream
          </h1>
          <p className='mt-2 text-gray-200'>
            Bringing the world of anime to your screen, anywhere and anytime.
          </p>
        </div>

        {/* Right section - Links */}
        <div className='flex flex-col md:flex-row gap-6 mt-6 md:mt-0 justify-center items-center'>
          <a href='#' className='text-gray-300 hover:text-white transition duration-300'>
            Privacy Policy
          </a>
          <a href='/contact' className='text-gray-300 hover:text-white transition duration-300'>
            Contact Us
          </a>
        </div>
      </div>

      {/* Bottom section */}
      <div className='mt-8 border-t border-gray-400 pt-4 text-center text-gray-300 text-sm'>
        &copy; 2024 aniStream. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
