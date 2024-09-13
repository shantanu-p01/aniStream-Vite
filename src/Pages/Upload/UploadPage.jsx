import React, { useState, useEffect } from 'react';
import { BiSolidTrash } from "react-icons/bi";

const UploadPage = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [animeName, setAnimeName] = useState('');
  const [episodeName, setEpisodeName] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  useEffect(() => {
    // Enable the Upload button only if all required fields are filled
    setIsUploadEnabled(animeName && episodeNumber && thumbnail && video);
  }, [animeName, episodeNumber, thumbnail, video]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
    }
  };

  const removeFile = (fileType) => {
    if (fileType === 'thumbnail') {
      setThumbnail(null);
    } else if (fileType === 'video') {
      setVideo(null);
    }
  };

  const clearFields = () => {
    // Clear all fields
    setThumbnail(null);
    setVideo(null);
    setAnimeName('');
    setEpisodeName('');
    setEpisodeNumber('');
    setDescription('');
  };

  const handleUpload = () => {
    if (isUploadEnabled) {
      // Perform upload logic here

      // Clear fields after upload
      clearFields();
    }
  };

  const handleDiscard = () => {
    // Clear fields on discard
    clearFields();
  };

  return (
    <main className='pt-20 p-2 min-h-screen h-full w-full'>
      <div className='flex flex-col h-full lg:flex-row items-center justify-center gap-4 max-w-5xl mx-auto p-2 bg-black/20 rounded-lg'>
        {/* Upload Section */}
        <div className='w-full lg:w-1/2 flex flex-row flex-wrap items-center justify-center gap-6'>
          {/* Thumbnail Upload Section */}
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='flex justify-between items-center w-full lg:max-w-md min-w-[250px] mb-2'>
              <h2 className='text-white text-lg font-bold text-center lg:text-left'>Upload Thumbnail</h2>
              {thumbnail && (
                <button
                  onClick={() => removeFile('thumbnail')}
                  className='btn btn-ghost min-h-fit h-fit p-2 text-red-500 text-2xl'
                >
                  <BiSolidTrash size="24" />
                </button>
              )}
            </div>
            <div
              className='relative w-full lg:max-w-md min-w-[250px] h-56 overflow-hidden rounded-lg border-2 border-dashed border-gray-600 bg-black/30 flex items-center justify-center cursor-pointer group'
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setThumbnail)}
            >
              {!thumbnail ? (
                <>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    id='thumbnail-upload'
                    onChange={handleThumbnailChange}
                  />
                  <label
                    htmlFor='thumbnail-upload'
                    className='w-full h-full flex items-center justify-center text-white cursor-pointer'
                  >
                    Drag & Drop Thumbnail or Click to Upload
                  </label>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt='Thumbnail'
                  className='object-cover h-full w-full'
                />
              )}
            </div>
          </div>

          {/* Video Upload Section */}
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='flex justify-between items-center w-full lg:max-w-md min-w-[250px] mb-2'>
              <h2 className='text-white text-lg font-bold text-center lg:text-left'>Upload Video</h2>
              {video && (
                <button
                  onClick={() => removeFile('video')}
                  className='btn btn-ghost min-h-fit h-fit p-2 text-red-500 text-2xl'
                >
                  <BiSolidTrash size="24" />
                </button>
              )}
            </div>
            <div
              className='relative w-full lg:max-w-md min-w-[250px] h-56 overflow-hidden rounded-lg border-2 border-dashed border-gray-600 bg-black/30 flex items-center justify-center cursor-pointer group'
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setVideo)}
            >
              {!video ? (
                <>
                  <input
                    type='file'
                    accept='video/*'
                    className='hidden'
                    id='video-upload'
                    onChange={handleVideoChange}
                  />
                  <label
                    htmlFor='video-upload'
                    className='w-full h-full flex items-center justify-center text-white cursor-pointer'
                  >
                    Drag & Drop Video or Click to Upload
                  </label>
                </>
              ) : (
                <video
                  src={URL.createObjectURL(video)}
                  controls
                  className='object-cover h-full w-full'
                />
              )}
            </div>
          </div>
        </div>

        {/* Episode Details Section */}
        <div className='w-full lg:w-1/2 flex flex-col gap-4 flex-1'>
          <div className='bg-black/20 p-4 rounded-lg flex-1'>
            <h2 className='text-white text-lg font-bold text-center lg:text-left mb-2'>Episode Details</h2>
            <div className='mb-4'>
              <label className='block text-white text-sm font-bold mb-2'>
                Anime Name
              </label>
              <input
                type='text'
                value={animeName}
                onChange={(e) => setAnimeName(e.target.value)}
                className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
              />
            </div>

            {/* Episode Name Input Field */}
            <div className='mb-4'>
              <label className='block text-white text-sm font-bold mb-2'>
                Episode Name (Optional)
              </label>
              <input
                type='text'
                value={episodeName}
                onChange={(e) => setEpisodeName(e.target.value)}
                className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-white text-sm font-bold mb-2'>
                Episode Number
              </label>
              <input
                type='text'
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
                className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-white text-sm font-bold mb-2'>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
                rows='4'
              />
            </div>

            <div className='flex flex-row items-center gap-2'>
              <button
                className={`btn btn-info w-1/2 text-white font-bold py-2 px-4 rounded-lg ${!isUploadEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleUpload}
                disabled={!isUploadEnabled}
              >
                Upload
              </button>
              <button
                className='btn btn-error w-1/2 text-white font-bold py-2 px-2 rounded-lg'
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;
