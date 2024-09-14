import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// Mapping anime titles to posters and hero images
const animeCards = [
  { title: 'One Piece', poster: '/posters/onePiecePoster.png', heroImage: '/carousel/onePieceHero.png' },
  { title: 'Kaiju No.8', poster: '/posters/kaijuNo8.png', heroImage: '/carousel/kaijuNo8Hero.png' },
  { title: 'Death Note', poster: '/posters/deathNotePoster.png', heroImage: '/carousel/deathNoteHero.png' },
  { title: 'Naruto', poster: '/posters/narutoPoster.png', heroImage: '/carousel/narutoHero.png' },
  { title: 'Attack on Titan', poster: '/posters/attackOnTitanPoster.png', heroImage: '/carousel/attackOnTitanHero.png' },
  { title: 'My Hero Academia', poster: '/posters/myHeroAcademiaPoster.png', heroImage: '/carousel/myHeroAcademiaHero.png' },
  { title: 'Dragon Ball Z', poster: '/posters/dragonBallZPoster.png', heroImage: '/carousel/dragonBallZHero.png' },
];

const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScrollBack: false, canScrollForward: true });
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const navigate = useNavigate();
  const heroRef = useRef(null); // Reference for the hero section

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

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 } // Fade in the new image
      );
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % animeCards.length);
    }, 5000); // Change the interval to 5000ms (5 seconds)

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (animeTitle) => {
    navigate(`/player?anime=${encodeURIComponent(animeTitle)}`);
  };

  return (
    <main className="pt-28 mb-5 p-2 min-h-screen">
      {/* Hero Section */}
      <div
        ref={heroRef} // Attach ref to the hero section
        className="hero h-[300px] md:h-[500px] max-w-7xl mx-auto rounded-lg bg-cover bg-center relative mb-8 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${animeCards[currentHeroIndex].heroImage})`,
        }}
      >
        <div className="hero-overlay absolute inset-0 bg-opacity-60 rounded-lg"></div>
        <div className="hero-content text-neutral-content text-left absolute bottom-0 left-0 p-6 pl-3 pb-3">
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold text-white/70">
              {animeCards[currentHeroIndex].title}
            </h1>
          </div>
        </div>
      </div>

      {/* Popular Anime Section */}
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
              onClick={() => handleCardClick(title)}
            >
              <img
                className="w-full h-[225px] object-cover rounded-lg"
                src={poster}
                alt={`${title} Poster`}
                draggable="false"
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
