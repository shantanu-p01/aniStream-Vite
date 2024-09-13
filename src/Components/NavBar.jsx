import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { FiSearch } from 'react-icons/fi';
import { GoHomeFill } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { BiSolidCloudUpload } from "react-icons/bi";
import { gsap } from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const drawerRef = useRef(null);
  const modalRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const highlightRef = useRef(null);
  const buttonRefs = useRef([]);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Function to toggle drawer visibility
  const toggleDrawer = useCallback(() => {
    if (isDrawerOpen) {
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setIsDrawerOpen(false),
      });
    } else {
      setIsDrawerOpen(true);
      gsap.fromTo(
        drawerRef.current,
        { x: '100%' },
        { x: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [isDrawerOpen]);

  // Function to toggle modal and animate search bar
  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  // Handle clicking outside of the modal
  const handleClickOutside = useCallback((event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  }, []);

  // Handle Escape key press
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      gsap.to(modalRef.current, { opacity: 1, duration: 0.3, ease: 'power3.out' });
      gsap.fromTo(
        searchBarRef.current,
        { y: '-50px', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', delay: 0.1, onComplete: () => {
          searchInputRef.current.focus();
        }}
      );
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: 'power3.in' });
      gsap.to(searchBarRef.current, { 
        y: '-50px', 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power3.in',
        onComplete: () => {
          setSearchText('');
        }
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleClickOutside, handleKeyDown]);

  // Function to move the highlight element to the active button
  const moveHighlight = (button) => {
    if (highlightRef.current && button) {
      const buttonRect = button.getBoundingClientRect();
      const navbarRect = button.parentElement.getBoundingClientRect();

      gsap.to(highlightRef.current, {
        x: buttonRect.left - navbarRect.left,
        width: buttonRect.width,
        duration: 0.3,
        ease: 'power3.out'
      });
    }
  };

  // Handle button clicks to navigate
  const handleNavigation = (path, buttonRef) => {
    navigate(path);
    if (isDrawerOpen) {
      toggleDrawer(); // Close drawer if open
    }
  };

  useEffect(() => {
    // Move the highlight to the active button on initial render or location change
    const activeButtonIndex = {
      '/': 0,
      '/player': 0, // Add /player to the home button
      '/upload': 1,
      '/contact': 2
    }[location.pathname];

    if (activeButtonIndex !== undefined) {
      setTimeout(() => moveHighlight(buttonRefs.current[activeButtonIndex]), 0); // Delay to allow for rendering
    }
  }, [location.pathname]);

  return (
    <header className='z-30 w-screen h-16 px-2 flex items-center justify-center fixed select-none'>
      <nav className='bg-[#1a1818]/40 shadow-xl backdrop-blur-sm w-[85%] md:w-[50%] h-full flex items-center justify-between px-4 rounded-full mt-4 relative'>
        {/* leftLogo */}
        <div className='title left text-2xl flex items-center'>
          <h1 className='text-white/80'>
            <span className='text-blue-500 font-semibold'>ani</span>Stream
          </h1>
        </div>
        {/* centerTabs */}
        <div className='tabs hidden center lg:flex flex-row items-center justify-center gap-2 relative'>
          {/* Highlight Element */}
          <div ref={highlightRef} className='absolute top-0 left-0 h-full bg-white/20 rounded-badge' style={{ width: 0 }} />
          <button
            ref={el => buttonRefs.current[0] = el}
            className={`btn btn-ghost rounded-badge px-4 py-2 h-fit min-h-fit text-white hover:bg-transparent ${location.pathname === '/' ? 'bg-transparent' : ''}`}
            onClick={() => handleNavigation('/', buttonRefs.current[0])}
          >
            Home
          </button>
          <button
            ref={el => buttonRefs.current[1] = el}
            className={`btn btn-ghost rounded-badge px-4 py-2 h-fit min-h-fit text-white hover:bg-transparent ${location.pathname === '/upload' ? 'bg-transparent' : ''}`}
            onClick={() => handleNavigation('/upload', buttonRefs.current[1])}
          >
            Upload
          </button>
          <button
            ref={el => buttonRefs.current[2] = el}
            className={`btn btn-ghost rounded-badge px-4 py-2 h-fit min-h-fit text-white hover:bg-transparent ${location.pathname === '/contact' ? 'bg-transparent' : ''}`}
            onClick={() => handleNavigation('/contact', buttonRefs.current[2])}
          >
            Contact
          </button>
        </div>
        {/* rightMenus */}
        <div className='menus right flex flex-row items-center justify-center pl-6 gap-[2px]'>
          <button className='cursor-pointer btn-ghost px-2 py-2 h-fit min-h-fit rounded-lg' onClick={toggleModal}>
            <FiSearch size='24' />
          </button>
          <button className='btn btn-ghost px-2 py-2 h-fit min-h-fit lg:hidden' onClick={toggleDrawer}>
            <HiMenuAlt3 size='24' />
          </button>
        </div>
      </nav>

      {/* Backdrop for Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-10`}
        onClick={toggleDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 w-3/4 max-w-[300px] h-full bg-[#1a1818] transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} z-20`}
      >
        <div className='p-4 flex flex-col gap-4'>
          <div className='m-2 flex justify-between items-center'>
            <span className='text-white/80 text-2xl font-semibold'>Menu</span>
            <button onClick={toggleDrawer} className='text-white/80 btn btn-ghost min-h-fit h-fit px-2 py-2 bg-black/50'>
              <CgClose size='24' />
            </button>
          </div>
          <button className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/' ? 'bg-black/50' : ''}`} onClick={() => handleNavigation('/', buttonRefs.current[0])}>
            Home
            <GoHomeFill size="24"/>
          </button>
          <button className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/upload' ? 'bg-black/50' : ''}`} onClick={() => handleNavigation('/upload', buttonRefs.current[1])}>
            Upload
            <BiSolidCloudUpload size="24"/>
          </button>
          <button className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/contact' ? 'bg-black/50' : ''}`} onClick={() => handleNavigation('/contact', buttonRefs.current[2])}>
            Contact
            <MdEmail size="24"/>
          </button>
        </div>
      </div>

      {/* Search Modal */}
      <div 
        ref={modalRef}
        className={`fixed inset-0 z-30 flex items-start justify-center px-4 bg-black/70 backdrop-blur-sm ${isModalOpen ? '' : 'pointer-events-none'}`}
        style={{ opacity: 0 }}
      >
        <div
          ref={searchBarRef}
          className='bg-[#292929] p-1 w-[85%] md:w-[50%] mx-4 rounded-full mt-3 shadow-lg'
          style={{ opacity: 0, transform: 'translateY(-50px)' }}
        >
          <div className='relative'>
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Search...'
              className='w-full p-3 pr-10 rounded-full bg-[#1f1f1f] text-white focus:outline-none'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
              >
                <CgClose size='18' />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
