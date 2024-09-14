import React from 'react';

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

  return (
    <main className="pt-28 p-2 min-h-screen h-full w-full">
      <div className="max-w-7xl mx-auto p-4 bg-black/20 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Popular Anime</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 scrollbar-hide snap-x snap-mandatory">
            {animeCards.map((anime, index) => (
              <div key={index} className="flex-none w-[175px] snap-start">
                <div className="bg-black/20 rounded-lg overflow-hidden shadow-lg transition-transform duration-300">
                  <img 
                    className="w-full h-[225px] object-cover rounded-lg"
                    src={anime.poster} 
                    alt={`${anime.title} Poster`}
                  />
                  <div className="p-2 flex items-center justify-center">
                    <h3 className="text-lg font-semibold text-white">{anime.title}</h3>
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