import React, { useState } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const HomePage = () => {
  const [videoSrc, setVideoSrc] = useState('/DeathNote1.mp4');
  const [activeEpisode, setActiveEpisode] = useState(1);

  const handleEpisodeChange = (episode) => {
    setActiveEpisode(episode);
    setVideoSrc(episode === 1 ? '/DeathNote1.mp4' : '/DeathNote2.mp4');
  };

  const plyrProps = {
    source: {
      type: 'video',
      sources: [
        {
          src: videoSrc,
          type: 'video/mp4',
        },
      ],
    },
    options: {
      autoplay: false,
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    },
  };

  return (
    <main className='pt-20 p-2 min-h-svh h-full w-full'>
      {/* 2nd Main Section */}
      <div className='flex max-w-fit p-2 rounded-lg h-full bg-black/20 flex-col md:flex-row items-center gap-2 md:items-start md:justify-center'>
        {/* Video Player */}
        <div className='w-full md:w-[55%] bg-white/20 rounded-lg overflow-hidden'>
          <Plyr {...plyrProps} />
        </div>
        {/* Episodes Section */}
        <div className='md:max-w-[300px] h-full rounded-lg bg-black/20 w-full'>
          <h1 className='text-2xl p-2'>Other Episodes</h1>
          <div className='p-2'>
            <button
              className={`w-full mb-2 py-2 text-white rounded-lg ${activeEpisode === 1 ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange(1)}
            >
              Episode 1
            </button>
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 2 ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange(2)}
            >
              Episode 2
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
