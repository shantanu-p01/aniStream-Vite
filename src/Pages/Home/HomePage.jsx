import React from 'react';

const HomePage = () => {
  return (
    <main className='pt-28 p-2 min-h-svh h-full w-full'>
      <div className='flex flex-row items-start gap-4 max-w-7xl mx-auto p-2 bg-black/20 rounded-lg'>

          <div className='w-[200px] h-fit bg-black/20 rounded-lg overflow-hidden flex flex-col items-center'>
            <img className='w-[200px] h-[300px] rounded-lg object-cover' src="/posters/onePiecePoster.png" alt="One Piece Poster" />
            <h1 className='text-lg font-semibold p-1'>One Piece</h1>
          </div>
          <div className='w-[200px] h-fit bg-black/20 rounded-lg overflow-hidden flex flex-col items-center'>
            <img className='w-[200px] h-[300px] rounded-lg object-cover' src="/posters/kaijuNo8.png" alt="One Piece Poster" />
            <h1 className='text-lg font-semibold p-1'>Kaiju No.8</h1>
          </div>
          <div className='w-[200px] h-fit bg-black/20 rounded-lg overflow-hidden flex flex-col items-center'>
            <img className='w-[200px] h-[300px] rounded-lg object-cover' src="/posters/deathNotePoster.png" alt="One Piece Poster" />
            <h1 className='text-lg font-semibold p-1'>Death Note</h1>
          </div>

      </div>
    </main>
  );
};

export default HomePage;
