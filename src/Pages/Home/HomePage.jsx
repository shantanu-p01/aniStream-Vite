import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const HomePage = () => {
  const animeCards = [
    { title: 'One Piece', poster: '/posters/onePiecePoster.png' },
    { title: 'Kaiju No.8', poster: '/posters/kaijuNo8.png' },
    { title: 'Death Note', poster: '/posters/deathNotePoster.png' },
    { title: 'One Piece', poster: '/posters/onePiecePoster.png' },
    { title: 'Naruto', poster: '/posters/narutoPoster.png' },
    { title: 'Attack on Titan', poster: '/posters/attackOnTitanPoster.png' },
    { title: 'My Hero Academia', poster: '/posters/myHeroAcademiaPoster.png' },
    { title: 'Dragon Ball Z', poster: '/posters/dragonBallZPoster.png' },
  ];

  const scrollContainerRef = useRef(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  // Handle scrolling forward
  const handleScrollForward = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 175, behavior: 'smooth' });
    }
  };

  // Handle scrolling backward
  const handleScrollBack = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -175, behavior: 'smooth' });
    }
  };

  // Check scroll position to enable/disable buttons
  useEffect(() => {
    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const tolerance = 5; // Tolerance to account for floating-point precision

      setCanScrollBack(scrollLeft > tolerance);
      setCanScrollForward(scrollLeft + clientWidth < scrollWidth - tolerance);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
    }
    
    checkScrollPosition(); // Initial check on mount

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  return (
    <main className="pt-28 p-2 min-h-screen h-full w-full">
      <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg">
        <div className='w-full h-full flex items-center justify-between mb-4'>
          <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
          <div className='w-fit h-full flex flex-row items-center gap-2'>
            <button 
              className='btn btn-ghost bg-black/20 hover:bg-black/30 min-h-fit h-fit p-1'
              onClick={handleScrollBack} 
              disabled={!canScrollBack}  // Disable if can't scroll back
            >
              <IoIosArrowBack size="24"/>
            </button>
            <button 
              className='btn btn-ghost bg-black/20 hover:bg-black/30 min-h-fit h-fit p-1'
              onClick={handleScrollForward} 
              disabled={!canScrollForward}  // Disable if can't scroll forward
            >
              <IoIosArrowForward size="24"/>
            </button>
          </div>
        </div>
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-auto rounded-lg space-x-4 scrollbar-hide snap-x snap-mandatory"
          >
            {animeCards.map((anime, index) => (
              <div key={index} className="flex-none w-[175px] snap-start">
                <div className="bg-black/20 rounded-lg overflow-hidden p-2 shadow-lg transition-transform duration-300">
                  <img 
                    className="w-full h-[225px] object-cover rounded-lg"
                    src={anime.poster} 
                    alt={`${anime.title} Poster`}
                  />
                  <div className="p-2 pb-0 flex items-center justify-center">
                    <h3 
                      className="text-lg font-semibold text-white truncate max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
                      title={anime.title}  // This will show the full title on hover
                    >
                      {anime.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
