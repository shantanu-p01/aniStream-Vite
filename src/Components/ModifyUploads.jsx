import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const ModifyUploads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animeData, setAnimeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodeDetails, setEpisodeDetails] = useState(null);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://192.168.101.70:5000/anime-episodes")
      .then((res) => res.json())
      .then((data) => {
        const groupedData = data.reduce((acc, { anime_name, season_number, episode_number, thumbnail_url, episode_name }) => {
          if (!acc[anime_name]) acc[anime_name] = { anime_name, thumbnail_url, total_seasons: 0, total_episodes: 0, episodes_by_season: {} };
          acc[anime_name].total_seasons = Math.max(acc[anime_name].total_seasons, season_number);
          acc[anime_name].total_episodes += 1;
          if (!acc[anime_name].episodes_by_season[season_number]) acc[anime_name].episodes_by_season[season_number] = [];
          acc[anime_name].episodes_by_season[season_number].push({ episode_number, episode_name });
          return acc;
        }, {});

        const animeList = Object.values(groupedData);
        setAnimeData(animeList);
      })
      .catch((err) => console.error("Error fetching anime data:", err));
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setFilteredAnime(query ? animeData.filter((anime) => anime.anime_name.toLowerCase().includes(query.toLowerCase())) : []);
  };

  const handleSelectAnime = (anime) => {
    setSelectedAnime(selectedAnime?.anime_name === anime.anime_name ? null : anime);
    setSelectedSeason(1);
    setIsModalOpen(false);
  };

  const handleSelectSeason = (season) => setSelectedSeason(season);

  const handleSelectEpisode = (episode, animeName, seasonNumber) => {
    const episodeDetail = animeData.find((anime) => anime.anime_name === animeName)?.episodes_by_season[seasonNumber]?.find((ep) => ep.episode_number === episode);
    if (episodeDetail) {
      setEpisodeDetails({ ...episodeDetail, anime_name: animeName, season_number: seasonNumber });
      setIsEpisodeModalOpen(true);
    }
  };

  const closeEpisodeModal = () => {
    setIsEpisodeModalOpen(false);
    setEpisodeDetails(null);
  };

  const handleDeleteEpisode = async () => {
    if (!episodeDetails) return;

    const episodeDetailsToDelete = {
      animeName: episodeDetails.anime_name,
      seasonNumber: episodeDetails.season_number,
      episodeNumber: episodeDetails.episode_number,
    };

    console.log("Deleting episode:", episodeDetailsToDelete); // Add this to check if correct values are being passed

    try {
      const response = await fetch("http://192.168.101.70:5000/delete-episode", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(episodeDetailsToDelete),
      });

      const result = await response.json();
      alert(result.message); // You can replace this with a success message or UI update
    } catch (error) {
      console.error("Error deleting episode:", error);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 w-full p-2 bg-black/20 rounded-lg">
      <div className="text-lg font-semibold self-start">Total Uploads: {animeData.reduce((total, anime) => total + anime.total_episodes, 0)}</div>
      <button className="btn btn-info py-3 px-2 self-start" onClick={() => setIsModalOpen(true)}>{selectedAnime?.anime_name || "Select Anime"}</button>

      {selectedAnime && (
        <div className="w-full">
          <h1 className="text-lg font-semibold mb-2">Seasons:</h1>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: selectedAnime.total_seasons }).map((_, index) => (
              <button key={index + 1} className={`py-2 px-4 rounded-lg bg-black/30 duration-500 text-white ${selectedSeason === index + 1 && "bg-white/30"}`} onClick={() => handleSelectSeason(index + 1)}>{index + 1}</button>
            ))}
          </div>
        </div>
      )}

      {selectedAnime && selectedSeason && (
        <div className="w-full">
          <h1 className="text-lg font-semibold mb-2">Episodes:</h1>
          <div className="flex gap-2 flex-wrap">
            {selectedAnime.episodes_by_season[selectedSeason]?.map((episode) => (
              <button key={episode.episode_number} className="py-2 px-4 rounded-lg bg-black/30 duration-300 hover:bg-white/30 text-white" onClick={() => handleSelectEpisode(episode.episode_number, selectedAnime.anime_name, selectedSeason)}>{episode.episode_number}</button>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50">
          <div onClick={(event) => event.stopPropagation()} className="bg-black/60 p-6 rounded-xl mt-10 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Search Anime</h2>
              <button onClick={() => setIsModalOpen(false)}><IoIosClose size="36" className="text-white" /></button>
            </div>
            <div className="flex items-center border rounded-lg p-2 mb-4">
              <FaSearch className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search for anime..." className="w-full bg-transparent outline-none" value={searchQuery} onChange={handleSearch} />
            </div>
            <div className="overflow-y-auto max-h-96">
              {filteredAnime.length > 0 ? filteredAnime.map((anime) => (
                <div key={anime.anime_name} onClick={() => handleSelectAnime(anime)} className={`flex items-center justify-between p-3 mx-1 my-1 rounded-xl ring-1 ring-transparent bg-white/20 text-white cursor-pointer ${selectedAnime?.anime_name === anime.anime_name && "ring-blue-400"}`}>
                  <div><h3 className="font-semibold">{anime.anime_name}</h3><p className="text-sm">Seasons: {anime.total_seasons}, Episodes: {anime.total_episodes}</p></div>
                  <img src={anime.thumbnail_url} alt={anime.anime_name} className="w-16 h-16 rounded-md object-cover" />
                </div>
              )) : <p className="text-gray-400 text-center">No results found.</p>}
            </div>
          </div>
        </div>
      )}

      {isEpisodeModalOpen && episodeDetails && (
        <div onClick={closeEpisodeModal} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50">
          <div onClick={(event) => event.stopPropagation()} className="bg-black/60 p-6 rounded-xl mt-10 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Episode Details</h2>
              <button onClick={closeEpisodeModal}><IoIosClose size="36" className="text-white" /></button>
            </div>
            <div className="text-white mb-4">
              <label className="block font-semibold">Anime Name:</label>
              <input type="text" className="w-full p-2 rounded-lg bg-gray-800 text-white" value={episodeDetails.anime_name} readOnly />
            </div>
            <div className="text-white mb-4">
              <label className="block font-semibold">Episode Name:</label>
              <input type="text" className="w-full p-2 rounded-lg bg-gray-800 text-white" value={episodeDetails.episode_name} readOnly />
            </div>
            <div className="w-full flex gap-4">
              <div className="w-full mb-4">
                <label className="block font-semibold">Episode No.:</label>
                <input type="number" className="w-full p-2 rounded-lg bg-gray-800 text-white" value={episodeDetails.episode_number} readOnly />
              </div>
              <div className="w-full mb-4">
                <label className="block font-semibold">Season No.:</label>
                <input type="number" className="w-full p-2 rounded-lg bg-gray-800 text-white" value={episodeDetails.season_number} readOnly />
              </div>
            </div>
            <button onClick={handleDeleteEpisode} className="btn btn-error py-3 px-2 w-full">Delete Episode</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyUploads;