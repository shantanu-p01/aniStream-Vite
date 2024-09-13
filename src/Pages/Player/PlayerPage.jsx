import React, { useState, useMemo } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

// Reusable component for a button (Season/Episode)
const Button = ({ isActive, onClick, children, disabled }) => (
  <button
    className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 transition duration-300 ${isActive ? 'bg-white/20' : 'bg-black/20'} text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const PlayerPage = () => {
  const [videoSrc, setVideoSrc] = useState('/1/DeathNote1.mp4');
  const [activeEpisode, setActiveEpisode] = useState('DeathNote1');
  const [likeStatuses, setLikeStatuses] = useState({});
  const [activeSeason, setActiveSeason] = useState(1); // State for active season button

  // Episodes list based on active season
  const episodes = {
    1: [{ episode: 'DeathNote1', file: '/1/DeathNote1.mp4' }, { episode: 'DeathNote2', file: '/1/DeathNote2.mp4' }],
    2: [{ episode: 'FamilyXSpy1', file: '/2/FamilyXSpy1.mp4' }],
    3: [{ episode: 'KaijuNo1', file: '/3/KaijuNo1.mp4' }, { episode: 'KaijuNo2', file: '/3/KaijuNo2.mp4' }],
  };

  // Handle episode change and set video source
  const handleEpisodeChange = (episode, file) => {
    setActiveEpisode(episode);
    setVideoSrc(file);
  };

  // Handle like/dislike button toggle
  const toggleLikeDislike = (type) => {
    setLikeStatuses((prevStatuses) => ({
      ...prevStatuses,
      [activeEpisode]: prevStatuses[activeEpisode] === type ? null : type,
    }));
  };

  // Handle season change and set default episode for the season
  const handleSeasonChange = (season) => {
    setActiveSeason(season);
    const defaultEpisodes = episodes[season];
    handleEpisodeChange(defaultEpisodes[0].episode, defaultEpisodes[0].file);
  };

  // Handle navigating to the next episode
  const handleNextEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);

    if (currentIndex < currentEpisodes.length - 1) {
      const nextEpisode = currentEpisodes[currentIndex + 1];
      handleEpisodeChange(nextEpisode.episode, nextEpisode.file);
    }
  };

  // Handle navigating to the previous episode
  const handlePreviousEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);

    if (currentIndex > 0) {
      const previousEpisode = currentEpisodes[currentIndex - 1];
      handleEpisodeChange(previousEpisode.episode, previousEpisode.file);
    }
  };

  // Determine if next/previous buttons should be disabled
  const currentEpisodes = episodes[activeSeason];
  const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
  const isNextDisabled = currentIndex === currentEpisodes.length - 1;
  const isPreviousDisabled = currentIndex === 0;

  // Plyr player properties
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
      keyboard: {
        global: true, // Enables keyboard controls for the video player
      },
    },
  }), [videoSrc]);

  const currentLikeStatus = likeStatuses[activeEpisode] || null;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // This will navigate you to the home path
  };
  
  return (
    <main className='pt-24 p-2 min-h-fit h-full w-full'>
      <div className='flex flex-col lg:flex-row items-center lg:items-start gap-2 max-w-7xl mx-auto p-2 bg-black/20 rounded-lg'>
        {/* Video Player */}
        <div className='w-full lg:w-2/3'>
        <div className='w-full py-2 flex flex-row items-center justify-start gap-2'>
      <button 
        className='btn btn-ghost transition duration-300 min-h-fit h-fit p-1 bg-white/20 hover:bg-white/30'
        onClick={handleBackClick}
      >
        <IoIosArrowBack size="24" />
      </button>
      <h1 className='text-xl font-semibold'>Anime Name - Episode (Number)</h1>
    </div>
          <div className='aspect-w-16 overflow-hidden rounded-lg aspect-h-9'>
            <Plyr {...plyrProps} />
          </div>
          <div className='w-full p-2 flex items-center justify-evenly gap-2 mt-2 rounded-lg bg-black/20'>
            <button
              className={`btn btn-ghost h-fit min-h-fit p-1 text-white/80 ${isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePreviousEpisode} // Attach the handlePreviousEpisode function
              disabled={isPreviousDisabled} // Disable button if there is no previous episode
            >
              <IoIosArrowBack size="24" />
              <h1 className='hidden sm:block pr-2'>Previous</h1>
            </button>
            <div className='flex items-center justify-center gap-8'>
              <button
                className={`btn btn-ghost h-fit min-h-fit p-1 ${currentLikeStatus === 'like' ? 'text-blue-500' : 'text-white/80'}`}
                onClick={() => toggleLikeDislike('like')}
              >
                <BiSolidLike size="24" />
                <h1 className='hidden sm:block'>Like</h1>
              </button>
              <button
                className={`btn btn-ghost h-fit min-h-fit p-1 ${currentLikeStatus === 'dislike' ? 'text-red-500' : 'text-white/80'}`}
                onClick={() => toggleLikeDislike('dislike')}
              >
                <BiSolidDislike size="24" />
                <h1 className='hidden sm:block'>Dislike</h1>
              </button>
            </div>
            <button
              className={`btn btn-ghost h-fit min-h-fit p-1 text-white/80 ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNextEpisode} // Attach the handleNextEpisode function
              disabled={isNextDisabled} // Disable button if there is no next episode
            >
              <h1 className='hidden sm:block pl-2'>Next</h1>
              <IoIosArrowForward size="24" />
            </button>
          </div>
        </div>

        {/* Episodes Section */}
        <div className='w-full lg:w-1/3 rounded-lg bg-black/20'>
          <h1 className='text-2xl p-2 pb-0 font-semibold'>Season</h1>
          {/* Season Buttons */}
          <div className="flex flex-wrap justify-start items-center gap-2 p-2 pb-4">
            {[1, 2, 3].map((season) => (
              <Button key={season} isActive={activeSeason === season} onClick={() => handleSeasonChange(season)}>
                {season}
              </Button>
            ))}
          </div>
          <h1 className='text-2xl px-2 pb-0 font-semibold'>Episodes</h1>
          {/* Episode Buttons */}
          <div className='flex flex-wrap justify-start items-center gap-2 p-2'>
            {episodes[activeSeason].map(({ episode, file }, index) => (
              <Button key={index} isActive={activeEpisode === episode} onClick={() => handleEpisodeChange(episode, file)}>
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlayerPage;
