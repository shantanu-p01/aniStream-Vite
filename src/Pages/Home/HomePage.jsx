import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const animeCards = [
  { title: 'One Piece', poster: '/posters/onePiecePoster.png' },
  { title: 'Kaiju No.8', poster: '/posters/kaijuNo8.png' },
  { title: 'Death Note', poster: '/posters/deathNotePoster.png' },
  { title: 'Naruto', poster: '/posters/narutoPoster.png' },
  { title: 'Attack on Titan', poster: '/posters/attackOnTitanPoster.png' },
  { title: 'My Hero Academia', poster: '/posters/myHeroAcademiaPoster.png' },
  { title: 'Dragon Ball Z', poster: '/posters/dragonBallZPoster.png' },
];

const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScrollBack: false, canScrollForward: true });
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleScroll = (amount) => scrollContainerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  useEffect(() => {
    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setScrollState({
        canScrollBack: scrollLeft > 5,
        canScrollForward: scrollLeft + clientWidth < scrollWidth - 5,
      });
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => container?.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const handleCardClick = (animeTitle) => {
    navigate(`/player?anime=${encodeURIComponent(animeTitle)}`); // Navigate to the /player route with the anime title as a query param
  };

  return (
    <main className="pt-28 mb-5 p-2 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg">
        <header className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost min-h-fit h-fit bg-black/20 hover:bg-black/30 p-1"
              onClick={() => handleScroll(-175)}
              disabled={!scrollState.canScrollBack}
            >
              <IoIosArrowBack size="24" />
            </button>
            <button
              className="btn btn-ghost min-h-fit h-fit bg-black/20 hover:bg-black/30 p-1"
              onClick={() => handleScroll(175)}
              disabled={!scrollState.canScrollForward}
            >
              <IoIosArrowForward size="24" />
            </button>
          </div>
        </header>
        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 rounded-lg scrollbar-hide snap-x snap-mandatory">
          {animeCards.map(({ title, poster }, index) => (
            <div
              key={index}
              className="transition duration-300 hover:bg-black/40 cursor-pointer flex-none w-[175px] snap-start bg-black/20 rounded-lg p-2 shadow-lg"
              onClick={() => handleCardClick(title)}  // Handle click event to navigate
            >
              <img
                className="w-full h-[225px] object-cover rounded-lg"
                src={poster}
                alt={`${title} Poster`}
                draggable="false"  // Disable dragging
              />
              <h3 className="text-lg font-semibold text-white text-center truncate mt-2" title={title}>
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
