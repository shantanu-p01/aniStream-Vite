import React, { useState, useRef, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isModalOpen, setIsModalOpen }) => {
  const [searchText, setSearchText] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const modalRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch anime data from API only once
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('http://192.168.1.2:5000/anime-episodes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Create a unique list of anime names
        const uniqueAnimeNames = [...new Set(data.map(anime => anime.anime_name))];
        setAnimeList(uniqueAnimeNames);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimeData();
  }, []);

  // Filter anime based on search text
  useEffect(() => {
    if (searchText) {
      const filtered = animeList.filter(animeName =>
        animeName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAnime(filtered);
    } else {
      setFilteredAnime([]);
    }
  }, [searchText, animeList]);

  // Handle clicking outside of the search bar (modal click closes, search bar click does not)
  const handleModalClick = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  // Handle Escape key press
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
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
      document.removeEventListener('keydown', handleKeyDown);
      gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: 'power3.in' });
      gsap.to(searchBarRef.current, { 
        y: '-50px', 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power3.in',
        onComplete: () => {
          setSearchText('');
          setFilteredAnime([]);
        }
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, setIsModalOpen]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAnimeSelect = (animeName) => {
    setSearchText(animeName);
    setFilteredAnime([]);
    setIsModalOpen(false);
    navigate(`/player?anime=${encodeURIComponent(animeName)}`);
  };

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 w-screen z-30 flex items-start justify-center px-4 bg-black/70 backdrop-blur-sm ${isModalOpen ? '' : 'pointer-events-none'}`}
      style={{ opacity: 0 }}
      onClick={handleModalClick} // Close when clicking on modal background
    >
      <div className="relative w-[85%] md:w-[50%]">
        <div
          ref={searchBarRef}
          className='bg-[#292929] p-1 rounded-full mt-3 shadow-lg'
          style={{ opacity: 0, transform: 'translateY(-50px)' }}
          onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on search bar
        >
          <div className='relative'>
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Search...'
              className='w-full p-3 pr-10 rounded-full bg-[#1f1f1f] text-white focus:outline-none'
              value={searchText}
              onChange={handleSearchChange}
            />
            {searchText && (
              <button
                onClick={() => {
                  setSearchText('');
                  setFilteredAnime([]);
                }}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
              >
                <CgClose size='18' />
              </button>
            )}
          </div>
        </div>
        {searchText && (
          <div className='w-full mt-2 absolute bg-black/20 flex flex-col justify-center items-center gap-2 p-2 rounded-lg shadow-lg overflow-hidden'>
            <div ref={dropdownRef} className="w-full bg-black/20 rounded-lg shadow-lg overflow-hidden">
              {filteredAnime.length > 0 ? (
                <ul className='max-h-60 overflow-y-auto'>
                  {filteredAnime.map((animeName, index) => (
                    <li
                      key={index}
                      className='px-4 py-2 hover:bg-[#3a3a3a] duration-300 cursor-pointer text-white'
                      onClick={() => handleAnimeSelect(animeName)}
                    >
                      {animeName}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='px-4 py-2 text-white'>No such anime found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;