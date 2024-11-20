import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { gsap } from 'gsap';
import axios from 'axios';

const Modal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black/80 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button className="btn btn-primary w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [scrollState, setScrollState] = useState({ canScrollBack: false, canScrollForward: true });
  const [isLoading, setIsLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]); // State to store anime data
  const [error, setError] = useState(null); // State to hold any error messages
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch anime data from the backend
  useEffect(() => {
    console.log("Fetching anime data...");
    const fetchAnimeData = async () => {
      try {
        const response = await axios.get('https://backend.kubez.cloud/anime-episodes');
        if (response.data.length === 0) {
          throw new Error("No anime data found in the database.");
        }
        
        // Filter out duplicate anime entries based on anime_name
        const uniqueAnimeData = Array.from(
          new Map(response.data.map(item => [item.anime_name, item])).values()
        );

        setAnimeData(uniqueAnimeData);
      } catch (err) {
        setError(err.message || "An error occurred while fetching anime data.");
        setIsModalOpen(true); // Open modal on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleScroll = (amount) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(() => updateScrollState(), 300);
    }
  };

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;

      setScrollState({
        canScrollBack: scrollLeft > 0,
        canScrollForward: scrollLeft < maxScrollLeft - 1,
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollState);
      updateScrollState();
      return () => {
        container.removeEventListener('scroll', updateScrollState);
      };
    }
  }, []);

  useEffect(() => {
    if (animeData.length > 0) {
      const interval = setInterval(() => {
        gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
        setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % animeData.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [animeData]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <main className="pt-28 mb-5 p-2 min-h-screen">
          {error && (
            <Modal
              isOpen={isModalOpen}
              title="Error"
              message={error}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {/* Hero Section */}
          {animeData.length > 0 && (
            <div
              ref={heroRef}
              className="hero h-[250px] md:h-[500px] max-w-7xl mx-auto rounded-lg bg-cover bg-center relative mb-8"
              style={{
                backgroundImage: animeData[currentHeroIndex]?.thumbnail_url
                  ? `url("${animeData[currentHeroIndex].thumbnail_url}")`
                  : "none",
              }}
            >
              <div className="hero-overlay absolute inset-0 bg-opacity-30 rounded-lg" />
              <div className="hero-content absolute bottom-0 left-0 p-6 pl-3 pb-3 text-white/70">
                <h1 className="text-4xl md:text-5xl font-bold truncate">
                  {animeData[currentHeroIndex]?.anime_name || "No Title"}
                </h1>
              </div>
            </div>
          )}

          {/* Popular Anime Section */}
          <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg">
            <header className="flex justify-between pb-2">
              <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
                  onClick={() => handleScroll(-175)}
                  disabled={!scrollState.canScrollBack}
                >
                  <IoIosArrowBack size="24" />
                </button>
                <button
                  className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
                  onClick={() => handleScroll(175)}
                  disabled={!scrollState.canScrollForward}
                >
                  <IoIosArrowForward size="24" />
                </button>
              </div>
            </header>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-3 rounded-lg snap-x snap-mandatory scrollbar-hide"
            >
              {animeData.map(({ anime_name, thumbnail_url }, index) => (
                <a
                  key={index}
                  href={`/player?anime=${encodeURIComponent(anime_name)}`}
                  className="flex-none w-[175px] snap-start bg-black/20 rounded-lg p-2 shadow-lg transition hover:bg-black/40"
                >
                  <img
                    draggable="false"
                    className="w-full h-[225px] object-cover rounded-lg"
                    src={thumbnail_url}
                    alt={`${anime_name} Thumbnail`}
                  />
                  <h3 className="text-lg font-semibold text-white text-center truncate mt-2">{anime_name}</h3>
                </a>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default HomePage;
