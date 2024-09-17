import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { gsap } from 'gsap';

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
  const heroRef = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [scrollState, setScrollState] = useState({ canScrollBack: false, canScrollForward: true });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleScroll = (amount) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(() => updateScrollState(), 300); // Update scroll state after the scroll
    }
  };

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;

      setScrollState({
        canScrollBack: scrollLeft > 0,
        canScrollForward: scrollLeft < maxScrollLeft - 1, // Ensure slight margin for floating point accuracy
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
    const interval = setInterval(() => {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % animeCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-svh">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <main className="pt-28 mb-5 p-2 min-h-screen">
          {/* Hero Section */}
          <div
            ref={heroRef}
            className="hero h-[250px] md:h-[500px] max-w-7xl mx-auto rounded-lg bg-cover bg-center relative mb-8"
            style={{ backgroundImage: `url(${animeCards[currentHeroIndex].heroImage})` }}
          >
            <div className="hero-overlay absolute inset-0 bg-opacity-60 rounded-lg" />
            <div className="hero-content absolute bottom-0 left-0 p-6 pl-3 pb-3 text-white/70">
              <h1 className="text-4xl md:text-5xl font-bold truncate">{animeCards[currentHeroIndex].title}</h1>
            </div>
          </div>

          {/* Popular Anime Section */}
          <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg">
            <header className="flex justify-between pb-2">
              <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
                  onClick={() => handleScroll(-175)}
                  disabled={!scrollState.canScrollBack} // Disable if can't scroll back
                >
                  <IoIosArrowBack size="24" />
                </button>
                <button
                  className="btn btn-ghost h-fit min-h-fit bg-black/20 hover:bg-black/30 p-1"
                  onClick={() => handleScroll(175)}
                  disabled={!scrollState.canScrollForward} // Disable if can't scroll forward
                >
                  <IoIosArrowForward size="24" />
                </button>
              </div>
            </header>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-3 rounded-lg snap-x snap-mandatory scrollbar-hide"
            >
              {animeCards.map(({ title, poster }, index) => (
                <a
                  key={index}
                  href={`/player?anime=${encodeURIComponent(title)}`}
                  className="flex-none w-[175px] snap-start bg-black/20 rounded-lg p-2 shadow-lg transition hover:bg-black/40"
                >
                  <img
                    draggable="false"
                    className="w-full h-[225px] object-cover rounded-lg"
                    src={poster}
                    alt={`${title} Poster`}
                  />
                  <h3 className="text-lg font-semibold text-white text-center truncate mt-2">{title}</h3>
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
