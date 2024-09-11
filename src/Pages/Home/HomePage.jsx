import React, { useState } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const HomePage = () => {
  const [videoSrc, setVideoSrc] = useState('/DeathNote1.mp4');
  const [activeEpisode, setActiveEpisode] = useState('DeathNote1');

  const handleEpisodeChange = (episode, file) => {
    setActiveEpisode(episode);
    setVideoSrc(file);
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
      ratio: '16:9',
    },
  };

  return (
    <main className='pt-20 p-2 min-h-svh h-full w-full'>
      <div className='flex flex-col lg:flex-row items-center lg:items-start gap-4 max-w-7xl mx-auto'>
        {/* Video Player */}
        <div className='w-full lg:w-2/3 bg-white/20 rounded-lg overflow-hidden'>
          <div className='aspect-w-16 aspect-h-9'>
            <Plyr {...plyrProps} />
          </div>
        </div>
        {/* Episodes Section */}
        <div className='w-full lg:w-1/3 rounded-lg bg-black/20'>
          <h1 className='text-2xl p-2'>Other Episodes</h1>
          <div className='p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
            {/* Death Note Episodes */}
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'DeathNote1' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('DeathNote1', '/DeathNote1.mp4')}
            >
              Death Note Episode 1
            </button>
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'DeathNote2' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('DeathNote2', '/DeathNote2.mp4')}
            >
              Death Note Episode 2
            </button>
            {/* FamilyXSpy Episodes */}
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'FamilyXSpy1' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('FamilyXSpy1', '/FamilyXSpy1.mp4')}
            >
              Family X Spy Episode 1
            </button>
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'FamilyXSpy2' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('FamilyXSpy2', '/FamilyXSpy2.mp4')}
            >
              Family X Spy Episode 2
            </button>
            {/* Kaiju No. Episodes */}
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'KaijuNo1' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('KaijuNo1', '/KaijuNo1.mp4')}
            >
              Kaiju No. Episode 1
            </button>
            <button
              className={`w-full py-2 text-white rounded-lg ${activeEpisode === 'KaijuNo2' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => handleEpisodeChange('KaijuNo2', '/KaijuNo2.mp4')}
            >
              Kaiju No. Episode 2
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;