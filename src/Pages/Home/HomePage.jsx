import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, title, message, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate('/contact'); // Navigate to /contact page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black/80 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button className="btn btn-primary w-full" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const AnimeSection = ({ title, animeList, scrollContainerRef, handleScroll, scrollState }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg mb-8">
      <header className="flex justify-between pb-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
            onClick={() => handleScroll(-175, scrollContainerRef)}
            disabled={!scrollState.canScrollBack}
          >
            <IoIosArrowBack size="24" />
          </button>
          <button
            className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
            onClick={() => handleScroll(175, scrollContainerRef)}
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
        {animeList.map(({ anime_name, thumbnail_url }, index) => (
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
  );
};

const HomePage = () => {
  const scrollContainerRefs = useRef({});
  const heroRef = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]);
  const [categorizedAnime, setCategorizedAnime] = useState({});
  const [latestAnime, setLatestAnime] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch anime data from the backend
  useEffect(() => {
    console.log('Fetching anime data...');
    const fetchAnimeData = async () => {
      try {
        const response = await axios.get('https://backend.kubez.cloud/anime-episodes');
        if (response.data.length === 0) {
          throw new Error('No anime data found in the database.');
        }

        const parsedAnimeData = response.data.map((anime) => ({
          ...anime,
          categories: JSON.parse(anime.categories), // Parse the categories JSON string
        }));

        // Sort anime data by uploaded date (assuming `uploaded_at` exists)
        const sortedAnime = [...parsedAnimeData].sort(
          (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
        );
        setLatestAnime(sortedAnime.slice(0, 10)); // Display top 10 latest anime

        const categorized = {};
        parsedAnimeData.forEach((anime) => {
          anime.categories.forEach((category) => {
            if (!categorized[category]) categorized[category] = [];
            categorized[category].push(anime);
          });
        });

        // Shuffle the anime in each category except for "Latest Anime"
        const shuffledCategorizedAnime = Object.fromEntries(
          Object.entries(categorized).map(([category, animeList]) => [
            category,
            shuffleArray(animeList),
          ])
        );

        setAnimeData(parsedAnimeData);
        setCategorizedAnime(shuffledCategorizedAnime);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching anime data.');
        setIsModalOpen(true);
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

  const handleScroll = (amount, ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const updateScrollState = (container) => {
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;
      return {
        canScrollBack: scrollLeft > 0,
        canScrollForward: scrollLeft < maxScrollLeft - 1,
      };
    }
    return { canScrollBack: false, canScrollForward: true };
  };

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
                  : 'none',
              }}
            >
              <div className="hero-overlay absolute inset-0 bg-opacity-30 rounded-lg" />
              <div className="hero-content absolute bottom-0 left-0 p-6 pl-3 pb-3 text-white/70">
                <h1 className="text-4xl md:text-5xl font-bold truncate">
                  {animeData[currentHeroIndex]?.anime_name || 'No Title'}
                </h1>
              </div>
            </div>
          )}

          {/* Latest Anime Section */}
          {latestAnime.length > 0 && (
            <AnimeSection
              title="Latest Anime"
              animeList={latestAnime}
              scrollContainerRef={(el) => (scrollContainerRefs.current['latest'] = el)}
              handleScroll={handleScroll}
              scrollState={updateScrollState(scrollContainerRefs.current['latest'])}
            />
          )}

          {/* Anime Sections */}
          {Object.entries(categorizedAnime)
            .filter(([_, animeList]) => animeList.length > 0)
            .map(([category, animeList]) => (
              <AnimeSection
                key={category}
                title={`${category.charAt(0).toUpperCase() + category.slice(1)} Anime`}
                animeList={animeList}
                scrollContainerRef={(el) => (scrollContainerRefs.current[category] = el)}
                handleScroll={handleScroll}
                scrollState={updateScrollState(scrollContainerRefs.current[category])}
              />
            ))}
        </main>
      )}
    </>
  );
};

export default HomePage;