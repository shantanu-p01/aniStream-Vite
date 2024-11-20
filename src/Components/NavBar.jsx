import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { FiSearch } from 'react-icons/fi';
import { GoHomeFill } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { BiSolidCloudUpload } from "react-icons/bi";
import { gsap } from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserProfileModal from './UserProfileModal';

const NavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const drawerRef = useRef(null);
  const highlightRef = useRef(null);
  const buttonRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('https://backend.kubez.cloud/auth/status', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      }
    };

    return () => checkAuthStatus();
  }, []);

  // Handle avatar/login button click
  const handleAuthClick = () => {
    if (!user) {
      navigate('/auth');
      if (isDrawerOpen) {
        toggleDrawer();
      }
    } else {
      setIsUserProfileModalOpen(true);
      if (isDrawerOpen) {
        toggleDrawer();
      }
    }
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    if (user && user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Function to toggle drawer visibility
  const toggleDrawer = useCallback(() => {
    if (isDrawerOpen) {
      document.body.classList.remove('pr-4');
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setIsDrawerOpen(false),
      });
    } else {
      if (window.innerWidth > 768) {
        document.body.classList.add('pr-4');
      }
      setIsDrawerOpen(true);
      gsap.fromTo(
        drawerRef.current,
        { x: '100%' },
        { x: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [isDrawerOpen]);

  // Function to toggle modal
  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  // Disable body scroll when modal or drawer is open
  useEffect(() => {
    if (isModalOpen || isDrawerOpen || isUserProfileModalOpen) {
      document.body.style.overflow = 'hidden';
      if (window.innerWidth > 768) {
        document.body.classList.add('pr-4');
      }
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('pr-4');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('pr-4');
    };
  }, [isModalOpen, isDrawerOpen, isUserProfileModalOpen]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isDrawerOpen) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    const activeButtonIndex = {
      '/': 0,
      '/player': 0,
      '/auth': 0,
      '/upload': 1,
      '/contact': 2
    }[location.pathname];

    if (activeButtonIndex !== undefined) {
      setTimeout(() => moveHighlight(buttonRefs.current[activeButtonIndex]), 0);
    }
  }, [location.pathname]);

  return (
    <>
      <header className='z-30 w-screen h-16 px-2 flex items-center justify-center fixed select-none'>
        <nav className='bg-[#1a1818]/40 shadow-xl backdrop-blur-sm w-[85%] md:w-[50%] h-full flex items-center justify-between px-4 rounded-full mt-4 relative'>
          {/* leftLogo */}
          <div className='title left text-2xl flex items-center pr-3'>
            <a href='/' className='text-white/80'>
              <span className='text-blue-500 font-semibold'>ani</span>Stream
            </a>
          </div>
          {/* centerTabs */}
          <div className='tabs hidden center lg:flex flex-row items-center justify-center gap-2 relative'>
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
          <div className='menus right flex flex-row items-center justify-center pl-3 gap-[2px] lg:gap-2'>
            <button className='cursor-pointer btn-ghost px-2 py-2 h-fit min-h-fit rounded-lg' onClick={toggleModal}>
              <FiSearch size='24' />
            </button>
            <button className='btn btn-ghost px-2 py-2 h-fit min-h-fit lg:hidden' onClick={toggleDrawer}>
              <HiMenuAlt3 size='24' />
            </button>
            <div 
              className="avatar hidden lg:block cursor-pointer ring-1 ring-primary btn-ghost h-fit min-h-fit rounded-full" 
              onClick={handleAuthClick}
            >
              <div className="w-10 rounded-full">
                <h1 className='flex items-center justify-center h-full font-semibold text-2xl bg-black/50'>
                  {getAvatarInitial()}
                </h1>
              </div>
            </div>
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
          <div className='p-4 flex flex-col gap-4 h-full'>
            <div className='m-2 flex justify-between items-center'>
              <span className='text-white/80 text-2xl font-semibold'>Menu</span>
              <button onClick={toggleDrawer} className='text-white/80 btn btn-ghost min-h-fit h-fit px-2 py-2 bg-black/50'>
                <CgClose size='24' />
              </button>
            </div>
            <div className='flex flex-col items- justify-between  h-full'>
              <div className='flex flex-col gap-4'>
                <button 
                  className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/' ? 'bg-black/50' : ''}`} 
                  onClick={() => handleNavigation('/', buttonRefs.current[0])}
                >
                  Home
                  <GoHomeFill size="24"/>
                </button>
                <button 
                  className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/upload' ? 'bg-black/50' : ''}`} 
                  onClick={() => handleNavigation('/upload', buttonRefs.current[1])}
                >
                  Upload
                  <BiSolidCloudUpload size="24"/>
                </button>
                <button 
                  className={`btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center ${location.pathname === '/contact' ? 'bg-black/50' : ''}`} 
                  onClick={() => handleNavigation('/contact', buttonRefs.current[2])}
                >
                  Contact
                  <MdEmail size="24"/>
                </button>
              </div>
              <button 
                className="btn btn-ghost px-4 py-2 h-fit min-h-fit hover:bg-black/50 text-white/80 text-lg justify-between items-center"
                onClick={handleAuthClick}
              >
                {user ? user.username : 'Login'}
                <div className="avatar cursor-pointer ring-1 ring-primary btn-ghost h-fit min-h-fit rounded-full">
                  <div className="w-10 rounded-full">
                    <h1 className='flex items-center justify-center h-full font-semibold text-2xl bg-black/50'>
                      {getAvatarInitial()}
                    </h1>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Search Modal */}
        <SearchBar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </header>

      {/* User Profile Modal */}
      <UserProfileModal 
        user={user} 
        isOpen={isUserProfileModalOpen} 
        onClose={() => setIsUserProfileModalOpen(false)} 
        setUser={setUser}
      />
    </>
  );
};

export default NavBar;