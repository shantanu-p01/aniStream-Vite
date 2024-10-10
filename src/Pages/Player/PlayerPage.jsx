import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
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
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

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
      fetchAnimeDetails(decodeURIComponent(anime));
    }
  }, [location]);

  const fetchAnimeDetails = async (anime) => {
    try {
      const response = await fetch(`http://192.168.101.74:5000/fetchAnimeDetails/${anime}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        const groupedEpisodes = data.reduce((acc, episode) => {
          const season = episode.season_number;
          if (!acc[season]) acc[season] = [];
          acc[season].push({
            episode: episode.episode_name,
            m3u8_url: episode.m3u8_url,
          });
          return acc;
        }, {});

        const sortedGroupedEpisodes = {};
        Object.keys(groupedEpisodes)
          .sort((a, b) => a - b)
          .forEach(season => {
            sortedGroupedEpisodes[season] = groupedEpisodes[season].sort((a, b) => a.episode.localeCompare(b.episode));
          });

        setEpisodes(sortedGroupedEpisodes);

        if (sortedGroupedEpisodes[1] && sortedGroupedEpisodes[1].length > 0) {
          handleEpisodeChange(sortedGroupedEpisodes[1][0].episode, sortedGroupedEpisodes[1][0].m3u8_url);
        }
      }
    } catch (error) {
      console.error('Error fetching anime details:', error);
    }
  };

  const handleEpisodeChange = (episode, m3u8Url) => {
    setActiveEpisode(episode);
    setVideoSrc(m3u8Url);
  };

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: (xhr, url) => {
            xhr.withCredentials = true; // This line enables sending cookies with the request
          }
        });
        hlsRef.current = hls;
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play().catch(error => console.log("Playback was prevented:", error));
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play().catch(error => console.log("Playback was prevented:", error));
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoSrc]);

  const toggleLikeDislike = (type) => {
    setLikeStatuses((prevStatuses) => ({
      ...prevStatuses,
      [activeEpisode]: prevStatuses[activeEpisode] === type ? null : type,
    }));
  };

  const handleSeasonChange = (season) => {
    setActiveSeason(season);
    const defaultEpisodes = episodes[season];
    if (defaultEpisodes && defaultEpisodes.length > 0) {
      handleEpisodeChange(defaultEpisodes[0].episode, defaultEpisodes[0].m3u8_url);
    }
  };

  const handleNextEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
    if (currentIndex < currentEpisodes.length - 1) {
      const nextEpisode = currentEpisodes[currentIndex + 1];
      handleEpisodeChange(nextEpisode.episode, nextEpisode.m3u8_url);
    }
  };

  const handlePreviousEpisode = () => {
    const currentEpisodes = episodes[activeSeason];
    const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
    if (currentIndex > 0) {
      const previousEpisode = currentEpisodes[currentIndex - 1];
      handleEpisodeChange(previousEpisode.episode, previousEpisode.m3u8_url);
    }
  };

  useEffect(() => {
    const player = videoRef.current;
    if (player) {
      player.addEventListener('ended', handleNextEpisode);
    }
    return () => {
      if (player) {
        player.removeEventListener('ended', handleNextEpisode);
      }
    };
  }, [videoSrc]);

  const currentEpisodes = episodes[activeSeason] || [];
  const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);
  const isNextDisabled = currentIndex === currentEpisodes.length - 1;
  const isPreviousDisabled = currentIndex === 0;

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
                <video ref={videoRef} controls className="w-full h-full" />
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
                    className={`btn ${currentLikeStatus === 'like' ? 'btn-primary' : 'btn-ghost'} text-white/80 transition duration-300`}
                    onClick={() => toggleLikeDislike('like')}
                  >
                    <BiSolidLike size="20" />
                  </button>
                  <button
                    className={`btn ${currentLikeStatus === 'dislike' ? 'btn-primary' : 'btn-ghost'} text-white/80 transition duration-300`}
                    onClick={() => toggleLikeDislike('dislike')}
                  >
                    <BiSolidDislike size="20" />
                  </button>
                </div>
                <button
                  className={`btn btn-ghost h-fit min-h-fit p-1 text-white/80 ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNextEpisode}
                  disabled={isNextDisabled}
                >
                  <h1 className='hidden sm:block pl-2'>Next</h1>
                  <IoIosArrowForward size="24" />
                </button>
              </div>
            </div>
            <div className='w-full lg:w-1/3 flex flex-col gap-2 bg-black/20 rounded-lg p-2'>
              <h2 className='text-lg font-semibold text-white'>Season:</h2>
              <div className='flex gap-1 flex-wrap'>
                {Object.keys(episodes).map((season) => (
                  <Button
                    key={season}
                    isActive={activeSeason === parseInt(season)}
                    onClick={() => handleSeasonChange(parseInt(season))}
                  >
                    {season}
                  </Button>
                ))}
              </div>
              <h2 className='text-lg font-semibold text-white'>Episode:</h2>
              <div className='flex gap-1 flex-wrap'>
                {episodes[activeSeason]?.map((ep) => (
                  <Button
                    key={ep.episode}
                    isActive={activeEpisode === ep.episode}
                    onClick={() => handleEpisodeChange(ep.episode, ep.m3u8_url)}
                  >
                    {ep.episode}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default PlayerPage;