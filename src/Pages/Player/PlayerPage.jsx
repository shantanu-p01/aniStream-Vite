import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player'; // Import ReactPlayer
import { GoHomeFill } from "react-icons/go";

// Reusable component for a button (Season/Episode)
const Button = ({ isActive, onClick, children }) => (
  <button
    className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 transition duration-300 ${isActive ? 'bg-white/20' : 'bg-black/20'} text-white`}
    onClick={onClick}
  >
    {children}
  </button>
);

const PlayerPage = () => {
  const [videoSrc, setVideoSrc] = useState(''); // Initially empty
  const [activeEpisode, setActiveEpisode] = useState('');
  const [activeSeason, setActiveSeason] = useState(1);
  const [animeName, setAnimeName] = useState('');
  const [episodes, setEpisodes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Load animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Fetch anime details when the component mounts
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
      setError(null);
      const response = await fetch(`http://192.168.1.2:5000/fetchAnimeDetails/${anime}`);
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
  
        // Fetch the first episode's m3u8 URL and start playing
        if (sortedGroupedEpisodes[1] && sortedGroupedEpisodes[1].length > 0) {
          const firstEpisode = sortedGroupedEpisodes[1][0];
          handleEpisodeChange(firstEpisode.episode, firstEpisode.m3u8_url); // Call to start playing the first episode
        }
      }
    } catch (error) {
      console.error('Error fetching anime details:', error);
      setError('Failed to fetch anime details. Please try again later.');
    }
  };
  
  const handleEpisodeChange = (episode, m3u8Url) => {
    console.log(`Changing episode to: ${episode}, URL: ${m3u8Url}`);
    setActiveEpisode(episode);
    setVideoSrc(m3u8Url); // Set the new video source to ReactPlayer
  };
  
  const handleSeasonChange = (season) => {
    console.log(`Changing season to: ${season}`);
    setActiveSeason(season);
    const defaultEpisodes = episodes[season];
    if (defaultEpisodes && defaultEpisodes.length > 0) {
      handleEpisodeChange(defaultEpisodes[0].episode, defaultEpisodes[0].m3u8_url);
    }
  };

  const currentEpisodes = episodes[activeSeason] || [];
  const currentIndex = currentEpisodes.findIndex(ep => ep.episode === activeEpisode);

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-svh">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <main className='pt-24 mb-5 p-2 min-h-svh h-full w-full'>
          <div className='flex flex-col lg:flex-row items-center lg:items-start gap-2 max-w-7xl mx-auto p-2 bg-black/20 rounded-lg'>
            <div className='w-full lg:w-2/3'>
            <div className='w-full pb-2 flex flex-row items-center justify-start gap-2'>
              <a href='/'
                className='btn btn-ghost transition duration-300 min-h-fit h-fit p-1 bg-white/20 hover:bg-white/30'
              >
                <GoHomeFill size="24" />
              </a>
              <h1 className='text-xl leading-[0] font-semibold'>{animeName} - {activeEpisode}</h1> {/* Using activeEpisode */}
            </div>
              {/* Video player container with ReactPlayer */}
              <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg"> {/* 16:9 aspect ratio */}
                {videoSrc ? (
                  <ReactPlayer
                    className='absolute top-0 left-0 w-full h-full'
                    url={videoSrc}
                    controls={true}
                    width='100%'
                    height='100%'
                  />
                ) : (
                  <div className="text-center text-white absolute top-0 left-0 w-full h-full flex items-center justify-center">Loading video...</div>
                )}
              </div>
            </div>
            <div className='flex flex-col w-full lg:w-1/3 max-h-[400px] overflow-auto bg-black/20 p-2 rounded-lg'>
              <h2 className='text-lg font-semibold'>Seasons</h2>
              <div className='flex flex-wrap gap-2'>
                {Object.keys(episodes).map(season => (
                  <Button key={season} isActive={activeSeason === Number(season)} onClick={() => handleSeasonChange(Number(season))}>
                    {season}
                  </Button>
                ))}
              </div>
              <h2 className='text-lg font-semibold'>Episodes</h2>
              <div className='flex flex-wrap gap-2'>
                {currentEpisodes.map((episode, index) => (
                  <Button
                    key={index}
                    isActive={activeEpisode === episode.episode}
                    onClick={() => handleEpisodeChange(episode.episode, episode.m3u8_url)}
                  >
                    {index + 1} {/* Display episode number */}
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