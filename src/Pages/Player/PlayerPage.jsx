import React, { useState, useMemo, useEffect } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";

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
  const [videoSrc, setVideoSrc] = useState('');
  const [activeEpisode, setActiveEpisode] = useState('');
  const [likeStatuses, setLikeStatuses] = useState({});
  const [activeSeason, setActiveSeason] = useState(1);
  const [animeName, setAnimeName] = useState('');
  const [episodes, setEpisodes] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Loader state

  const navigate = useNavigate();
  const location = useLocation();

  // Simulate loading for 1 second when routed
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const anime = searchParams.get('anime');
    if (anime) {
      setAnimeName(decodeURIComponent(anime));
      fetchAnimeDetails(decodeURIComponent(anime)); // Fetch anime details on mount
    }
  }, [location]);

  // Fetch anime details from the server
  const fetchAnimeDetails = async (anime) => {
    try {
      // Update the URL to use a path parameter instead of a query parameter
      const response = await fetch(`http://192.168.101.74:5000/fetchAnimeDetails/${anime}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Assuming data contains an array of episodes
      if (Array.isArray(data)) {
        const groupedEpisodes = data.reduce((acc, episode) => {
          const season = episode.season_number;
          if (!acc[season]) acc[season] = [];
          acc[season].push({
            episode: episode.episode_name,
            chunk_urls: episode.chunk_urls, // Keep chunk_urls as an array of URLs
          });
          return acc;
        }, {});

        setEpisodes(groupedEpisodes);
        // Set initial episode if available
        if (groupedEpisodes[1] && groupedEpisodes[1].length > 0) {
          handleEpisodeChange(groupedEpisodes[1][0].episode, groupedEpisodes[1][0].chunk_urls);
        }
      }
    } catch (error) {
      console.error('Error fetching anime details:', error);
    }
  };

  // Handle episode change and set video source
  const handleEpisodeChange = (episode, chunkUrls) => {
    setActiveEpisode(episode);
    setVideoSrc(mergeChunkUrls(chunkUrls)); // Merge chunk URLs
  };

  // Function to merge chunk URLs into a single source for the player
  const mergeChunkUrls = (chunkUrls) => {
    return chunkUrls.join(','); // Joining URLs, adjust if needed for your video player
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
    if (defaultEpisodes && defaultEpisodes.length > 0) {
      handleEpisodeChange(defaultEpisodes[0].episode, defaultEpisodes[0].chunk_urls);
    }
  };

  // Handle navigating to the next episode
  const handleNextEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
    if (currentIndex < currentEpisodes.length - 1) {
      const nextEpisode = currentEpisodes[currentIndex + 1];
      handleEpisodeChange(nextEpisode.episode, nextEpisode.chunk_urls);
    }
  };

  // Handle navigating to the previous episode
  const handlePreviousEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
    if (currentIndex > 0) {
      const previousEpisode = currentEpisodes[currentIndex - 1];
      handleEpisodeChange(previousEpisode.episode, previousEpisode.chunk_urls);
    }
  };

  // Detect when video finishes to automatically play the next episode
  useEffect(() => {
    const player = document.querySelector('.plyr');
    if (player) {
      player.addEventListener('ended', handleNextEpisode);
    }
    return () => {
      if (player) {
        player.removeEventListener('ended', handleNextEpisode);
      }
    };
  }, [videoSrc]);

  // Determine if next/previous buttons should be disabled
  const currentEpisodes = episodes[activeSeason] || [];
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
        global: true,
      },
    },
  }), [videoSrc]);

  const currentLikeStatus = likeStatuses[activeEpisode] || null;

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-svh">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <main className='pt-24 mb-5 p-2 min-h-fit h-full w-full'>
          <div className='flex flex-col lg:flex-row items-center lg:items-start gap-2 max-w-7xl mx-auto p-2 bg-black/20 rounded-lg'>
            {/* Video Player */}
            <div className='w-full lg:w-2/3'>
              <div className='w-full pb-2 flex flex-row items-center justify-start gap-2'>
                <a href='/'
                  className='btn btn-ghost transition duration-300 min-h-fit h-fit p-1 bg-white/20 hover:bg-white/30'
                >
                  <GoHomeFill size="24" />
                </a>
                <IoIosArrowForward className='min-h-fit h-fit' /> 
                <h1 className='text-xl leading-[0] font-semibold'>{animeName} - Episode {currentIndex + 1}</h1>
              </div>
              <div className='aspect-w-16 overflow-hidden rounded-lg aspect-h-9'>
                <Plyr {...plyrProps} />
              </div>
              <div className='w-full p-2 flex items-center justify-evenly gap-2 mt-2 rounded-lg bg-black/20'>
                <button
                  className={`btn btn-ghost h-fit min-h-fit p-1 text-white/80 ${isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handlePreviousEpisode}
                  disabled={isPreviousDisabled}
                >
                  <IoIosArrowBack size="24" />
                  <h1 className='hidden sm:block pr-2'>Previous</h1>
                </button>
                <div className='flex items-center justify-center gap-1'>
                  <button
                    className={`btn ${currentLikeStatus === 'like' ? 'btn-primary' : 'btn-ghost'} h-fit min-h-fit p-1 text-white/80`}
                    onClick={() => toggleLikeDislike('like')}
                  >
                    <BiSolidLike size="24" />
                  </button>
                  <button
                    className={`btn ${currentLikeStatus === 'dislike' ? 'btn-primary' : 'btn-ghost'} h-fit min-h-fit p-1 text-white/80`}
                    onClick={() => toggleLikeDislike('dislike')}
                  >
                    <BiSolidDislike size="24" />
                  </button>
                </div>
                <button
                  className={`btn btn-ghost h-fit min-h-fit p-1 text-white/80 ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNextEpisode}
                  disabled={isNextDisabled}
                >
                  <h1 className='hidden sm:block pr-2'>Next</h1>
                  <IoIosArrowForward size="24" />
                </button>
              </div>
            </div>

            {/* Episode and Season Selector */}
            <div className='w-full lg:w-1/3 p-2'>
              <div className='flex flex-col'>
                <h2 className='text-lg font-bold text-white'>Select Season:</h2>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {Object.keys(episodes).map(season => (
                    <Button
                      key={season}
                      isActive={activeSeason == season}
                      onClick={() => handleSeasonChange(season)}
                    >
                      S{season}
                    </Button>
                  ))}
                </div>
              </div>
              <div className='flex flex-col mt-2'>
                <h2 className='text-lg font-bold text-white'>Select Episode:</h2>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {episodes[activeSeason]?.map((episode, index) => (
                    <Button
                      key={index}
                      isActive={activeEpisode === episode.episode}
                      onClick={() => handleEpisodeChange(episode.episode, episode.chunk_urls)}
                    >
                      {episode.episode}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default PlayerPage;
