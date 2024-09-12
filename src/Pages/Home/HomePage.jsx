import React, { useState, useMemo } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const HomePage = () => {
  const [videoSrc, setVideoSrc] = useState('/DeathNote1.mp4');
  const [activeEpisode, setActiveEpisode] = useState('DeathNote1');
  const [likeStatuses, setLikeStatuses] = useState({}); // Stores like/dislike status for each video

  const handleEpisodeChange = (episode, file) => {
    setActiveEpisode(episode);
    setVideoSrc(file);
  };

  const handleLike = () => {
    setLikeStatuses((prevStatuses) => ({
      ...prevStatuses,
      [activeEpisode]: prevStatuses[activeEpisode] === 'like' ? null : 'like', // Toggle like
    }));
  };

  const handleDislike = () => {
    setLikeStatuses((prevStatuses) => ({
      ...prevStatuses,
      [activeEpisode]: prevStatuses[activeEpisode] === 'dislike' ? null : 'dislike', // Toggle dislike
    }));
  };

  // Memoize plyrProps to prevent unnecessary re-renders
  const plyrProps = useMemo(() => ({
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
  }), [videoSrc]); // Only re-create plyrProps when videoSrc changes

  // Get the like/dislike status for the current video
  const currentLikeStatus = likeStatuses[activeEpisode] || null;

  return (
    <main className='pt-20 p-2 min-h-svh h-full w-full'>
      <div className='flex flex-col lg:flex-row items-center lg:items-start gap-2 max-w-7xl mx-auto p-2 bg-black/20 rounded-lg'>
        {/* Video Player */}
        <div className='w-full lg:w-2/3'>
          <div className='aspect-w-16 overflow-hidden rounded-lg aspect-h-9'>
            <Plyr {...plyrProps} />
          </div>
          <div className='w-full p-2 flex items-center justify-evenly gap-2 mt-2 rounded-lg bg-black/20'>
            <button className='btn btn-ghost h-fit min-h-fit p-1 text-white/80'>
              <IoIosArrowBack size="24" />
              <h1 className='hidden sm:block'>Previous</h1>
            </button>
            <div className='flex items-center justify-center gap-8'>
              <button
                className={`btn btn-ghost h-fit min-h-fit p-1 ${currentLikeStatus === 'like' ? 'text-blue-500' : 'text-white/80'}`}
                onClick={handleLike}
              >
                <BiSolidLike size="24" />
                <h1 className='hidden sm:block'>Like</h1>
              </button>
              <button
                className={`btn btn-ghost h-fit min-h-fit p-1 ${currentLikeStatus === 'dislike' ? 'text-red-500' : 'text-white/80'}`}
                onClick={handleDislike}
              >
                <BiSolidDislike size="24" />
                <h1 className='hidden sm:block'>DisLike</h1>
              </button>
            </div>
            <button className='btn btn-ghost h-fit min-h-fit p-1 text-white/80'>
              <h1 className='hidden sm:block'>Next</h1>
              <IoIosArrowForward size="24" />
            </button>
          </div>
        </div>
        {/* Episodes Section */}
        <div className='w-full lg:w-1/3 rounded-lg bg-black/20'>
          <h1 className='text-2xl p-2 font-semibold'>Season</h1>
          <h1 className='text-2xl px-2 pb-1 font-semibold'>Other Episodes</h1>
          <div className='p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
            {/* Death Note Episodes */}
            <button
              className={`w-full py-2 text-white transition duration-300 rounded-lg ${activeEpisode === 'DeathNote1' ? 'bg-white/10' : 'bg-black/20'}`}
              onClick={() => handleEpisodeChange('DeathNote1', '/DeathNote1.mp4')}
            >
              Death Note Episode 1
            </button>
            <button
              className={`w-full py-2 text-white transition duration-300 rounded-lg ${activeEpisode === 'DeathNote2' ? 'bg-white/10' : 'bg-black/20'}`}
              onClick={() => handleEpisodeChange('DeathNote2', '/DeathNote2.mp4')}
            >
              Death Note Episode 2
            </button>
            {/* FamilyXSpy Episodes */}
            <button
              className={`w-full py-2 text-white transition duration-300 rounded-lg ${activeEpisode === 'FamilyXSpy1' ? 'bg-white/10' : 'bg-black/20'}`}
              onClick={() => handleEpisodeChange('FamilyXSpy1', '/FamilyXSpy1.mp4')}
            >
              Family X Spy Episode 1
            </button>
            {/* Kaiju No. Episodes */}
            <button
              className={`w-full py-2 text-white transition duration-300 rounded-lg ${activeEpisode === 'KaijuNo1' ? 'bg-white/10' : 'bg-black/20'}`}
              onClick={() => handleEpisodeChange('KaijuNo1', '/KaijuNo1.mp4')}
            >
              Kaiju No. Episode 1
            </button>
            <button
              className={`w-full py-2 text-white transition duration-300 rounded-lg ${activeEpisode === 'KaijuNo2' ? 'bg-white/10' : 'bg-black/20'}`}
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
