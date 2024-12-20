import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiSolidTrash } from "react-icons/bi";
import ModifyUploads from '../../Components/ModifyUploads';

const UploadPage = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState('checking');
  const [isAdmin, setIsAdmin] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [animeName, setAnimeName] = useState('');
  const [episodeName, setEpisodeName] = useState('');
  const [seasonNumber, setSeasonNumber] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModifyUploads, setShowModifyUploads] = useState(false);

  // Authentication status check
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Helper function to get a cookie value by name
        const getCookie = (name) => {
          const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
          return matches ? decodeURIComponent(matches[1]) : null;
        };

        // Fetch the token from cookies
        const token = getCookie('token'); // Replace with the actual cookie name storing the token

        if (!token) {
          console.log('No token found in cookies.');
          setAuthStatus('guest');
          setIsLoading(false);
          return;
        }

        // Send API request with the token in headers
        const response = await axios.get('https://backend.kubez.cloud/auth/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuthStatus('authenticated');
        setIsAdmin(response.data.isAdmin || false);

        if (response.data.isAdmin) {
          console.log('Welcome Admin');
        } else {
          console.log('Authenticated user');
        }
      } catch (err) {
        console.log('Authentication error:', err.response?.data?.message || err.message);
        setAuthStatus('guest');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleFileChange = (e, setFile, isVideo = false) => {
    if (loading) return; // Prevent file changes during upload
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const validVideoTypes = ['video/mp4', 'video/x-matroska']; // `video/x-matroska` covers MKV format
  
      if (isVideo) {
        if (!validVideoTypes.includes(file.type)) {
          setModalMessage('Only MP4 and MKV video files are accepted.');
          setShowModal(true);
          return;
        }
      } else {
        if (!validImageTypes.includes(file.type)) {
          setModalMessage('Only JPEG, JPG, and PNG image files are accepted.');
          setShowModal(true);
          return;
        }
      }
  
      setFile(file);
      if (isVideo) {
        setVideoURL(URL.createObjectURL(file));
      }
    }
  };  

  // Function to toggle category selection
  const toggleCategorySelection = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category); // Remove category if already selected
      } else {
        return [...prev, category]; // Add category if not selected
      }
    });
  };

  // Open Categories Modal and store the current selected categories
  const openCategoriesModal = () => {
    setTempCategories([...selectedCategories]); // Store the selected categories before opening modal
    setShowCategoriesModal(true);
  };

  // Handle closing the modal without saving (reverts categories)
  const handleCloseCategoriesModal = () => {
    setSelectedCategories([...tempCategories]); // Revert to the stored categories
    setShowCategoriesModal(false);
  };

  const toggleModifyUploads = () => {
    setShowModifyUploads((prev) => !prev);
  };

  const handleDrop = (e, setFile, isVideo = false) => {
    if (loading) return; // Prevent drops during upload
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } }, setFile, isVideo);
  };

  const handleUpload = async () => {
    const emptyFields = [];
    if (!animeName) emptyFields.push('Anime Name');
    if (!seasonNumber) emptyFields.push('Season Number');
    if (!episodeNumber) emptyFields.push('Episode Number');
    if (!thumbnail) emptyFields.push('Thumbnail');
    if (!video) emptyFields.push('Video');
    if (!episodeName) emptyFields.push('Episode Name');
    if (!description) emptyFields.push('Description');
    if (selectedCategories.length === 0) emptyFields.push('Categories'); // Check for categories
  
    if (emptyFields.length) {
      setModalMessage(
        emptyFields.length === 8
          ? 'All required fields are empty.'
          : 'The following required fields are empty:'
      );
      setMissingFields(emptyFields.length === 8 ? [] : emptyFields);
      setShowModal(true);
    } else {
      performUpload();
    }
  };  
  
  const handleConfirmUpload = () => {
    setShowConfirmation(false);
    performUpload();
  };
  
  const performUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('animeName', animeName);
      formData.append('seasonNumber', seasonNumber);
      formData.append('episodeNumber', episodeNumber);
      formData.append('thumbnail', thumbnail);
      formData.append('video', video);
      formData.append('episodeName', episodeName);
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('description', description);
    
      const response = await fetch('https://backend.kubez.cloud/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        showLoaderAndSuccess();
      } else {
        setModalMessage('Failed to upload files.');
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('An error occurred while uploading.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };  

  const showLoaderAndSuccess = () => {
    setLoading(true);
    setShowConfirmation(false);
    setTimeout(() => {
      clearFields();
      setLoading(false);
      setModalMessage('Success! Episode uploaded successfully.');
      setShowSuccessModal(true);
    }, 2000);
  };

  const clearFields = () => {
    setThumbnail(null);
    setVideo(null);
    setVideoURL('');
    setAnimeName('');
    setEpisodeName('');
    setSeasonNumber('');
    setEpisodeNumber('');
    setDescription('');
  };

  const handleDiscard = () => {
    if (loading) return; // Prevent discard during upload
    if (!animeName && !episodeName && !seasonNumber && !episodeNumber && !description && !thumbnail && !video) {
      setModalMessage('All fields are already empty');
      setShowModal(true);
    } else {
      clearFields();
    }
  };

  const renderUploadSection = (label, file, setFile, accept, isVideo = false) => (
    <div className='flex-1 flex flex-col items-center justify-center'>
      <div className='flex justify-between items-center w-full lg:max-w-md min-w-[200px] mb-2'>
        <h2 className='text-white py-2 text-lg font-bold text-center lg:text-left'>{`Upload ${label}`}</h2>
        {file && !loading && (
          <button onClick={() => { setFile(null); if (isVideo) setVideoURL(''); }} className='btn btn-ghost min-h-fit h-fit p-2 text-red-500 text-2xl'>
            <BiSolidTrash size="24" />
          </button>
        )}
      </div>
      <div
        className={`relative w-full lg:max-w-md min-w-[200px] h-56 overflow-hidden rounded-lg border-2 border-dashed border-gray-600 bg-black/30 flex items-center justify-center ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} group`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, setFile, isVideo)}
      >
        {!file ? (
          <>
            <input type='file' accept={accept} className='hidden' id={`${label.toLowerCase()}-upload`} onChange={(e) => handleFileChange(e, setFile, isVideo)} disabled={loading} />
            <label htmlFor={`${label.toLowerCase()}-upload`} className={`w-full text-center h-full flex items-center justify-center text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              {`Drag & Drop ${label} or Click to Upload`}
            </label>
          </>
        ) : isVideo ? (
          <video src={videoURL} controls className='object-contain h-full w-full' />
        ) : (
          <img src={URL.createObjectURL(file)} alt={label} className='object-cover h-full w-full' />
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center h-full w-full items-center min-h-svh">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  if (authStatus === 'guest' || !isAdmin) {
    return (
      <div className='w-full h-screen'>
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Admin Access Required</h3>
            <p className="py-4">You need to be an admin to perform this action.</p>
            <div className="modal-action">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
        <main className='pt-24 p-2 min-h-screen h-full w-full pb-10'>
          <div className='flex flex-col h-full items-center justify-center gap-4 max-w-5xl mx-auto p-2 bg-black/20 rounded-lg'>

            {/* Heading Section */}
            <div className='w-full flex flex-row items-center justify-between gap-4 max-w-5xl mx-auto p-2 bg-black/20 rounded-lg h-14'>
              <h1 className='text-2xl hover:scale-95 duration-700 font-semibold'>
                {showModifyUploads ? 'Modify Uploads' : 'Upload Episode'}
              </h1>
              <button
                onClick={toggleModifyUploads}
                className={`btn py-3 px-2 min-h-fit h-fit ${showModifyUploads ? 'btn-error' : 'btn-info'}`}
              >
                {showModifyUploads ? 'Close' : 'Modify Uploads'}
              </button>
            </div>

            {/* Conditional Rendering */}
            {!showModifyUploads ? (
              <div className='flex flex-col h-full lg:flex-row items-center justify-center gap-4 max-w-5xl mx-auto p-2 bg-black/20 rounded-lg'>
                <div className='w-full lg:w-1/2 flex flex-row flex-wrap items-center justify-center gap-4'>
                  <div className='w-full flex flex-col md:flex-row gap-4'>
                    {renderUploadSection('Thumbnail', thumbnail, setThumbnail, 'image/*')}
                  </div>
                  {renderUploadSection('Video', video, setVideo, 'video/*', true)}
                </div>
                <div className='w-full lg:w-1/2 flex flex-col gap-4 flex-1'>
                  <div className='bg-black/20 p-4 rounded-lg flex-1'>
                    <h2 className='text-white text-lg font-bold text-center lg:text-left mb-2'>Episode Details</h2>
                    {[
                      { label: 'Anime Name', value: animeName, onChange: setAnimeName },
                      { label: 'Episode Name', value: episodeName, onChange: setEpisodeName },
                    ].map(({ label, value, onChange }) => (
                      <div className='mb-4' key={label}>
                        <label className='block text-white text-sm font-bold mb-2'>{label}</label>
                        <input
                          type='text'
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
                          disabled={loading}
                        />
                      </div>
                    ))}
                    <div className='flex flex-row gap-4 mb-4'>
                      <div className='w-1/2'>
                        <label className='block text-white text-sm font-bold mb-2'>Season Number</label>
                        <input
                          type='text'
                          inputMode='numeric'
                          value={seasonNumber}
                          onChange={(e) => setSeasonNumber(e.target.value.replace(/\D/g, ''))}
                          onWheel={(e) => e.target.blur()} // Prevent scrolling behavior
                          className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none'
                          disabled={loading}
                        />
                      </div>
                      <div className='w-1/2'>
                        <label className='block text-white text-sm font-bold mb-2'>Episode Number</label>
                        <input
                          type='text'
                          inputMode='numeric'
                          value={episodeNumber}
                          onChange={(e) => setEpisodeNumber(e.target.value.replace(/\D/g, ''))}
                          onWheel={(e) => e.target.blur()} // Prevent scrolling behavior
                          className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none'
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-white text-sm font-bold mb-2">Categories</label>
                      <button
                        onClick={openCategoriesModal}
                        className="w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                        disabled={loading}
                      >
                        {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select Categories'}
                      </button>
                    </div>
                    <div className='mb-4'>
                      <label className='block text-white text-sm font-bold mb-2'>Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500'
                        rows='4'
                        disabled={loading}
                      />
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <button onClick={handleUpload} className='btn btn-info w-1/2 text-white font-bold py-2 px-4 rounded-lg' disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                      </button>
                      <button onClick={handleDiscard} className='btn btn-error w-1/2 text-white font-bold py-2 px-2 rounded-lg' disabled={loading}>Discard</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ModifyUploads />
            )}
          </div>
          {showModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{modalMessage}</h3>
                <ul className='list-disc list-inside mt-2'>
                  {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
                </ul>
                <div className="modal-action">
                  <button onClick={() => setShowModal(false)} className="btn">Okay</button>
                </div>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{modalMessage}</h3>
                <div className="modal-action">
                  <button onClick={() => setShowConfirmation(false)} className="btn btn-error">Cancel</button>
                  <button onClick={handleConfirmUpload} className="btn btn-success">Continue</button>
                </div>
              </div>
            </div>
          )}

          {showSuccessModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{modalMessage}</h3>
                <div className="modal-action">
                  <button onClick={() => setShowSuccessModal(false)} className="btn">Close</button>
                </div>
              </div>
            </div>
          )}

          {showCategoriesModal && (
            <div className="modal modal-open">
              <div className="modal-box pt-4">
                <h3 className="font-bold text-lg pb-5">Select Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Shonen', 'Seinen', 'Mystery', 'Comedy', 'Magic', 'Horror', 'Romance', 'Adventure'].map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategorySelection(category)}
                      className={`btn ${selectedCategories.includes(category) ? 'btn-success' : 'btn-ghost'} w-auto`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="modal-action">
                  <button onClick={handleCloseCategoriesModal} className="btn btn-error">Close</button>
                  <button
                    onClick={() => setShowCategoriesModal(false)}
                    className="btn btn-success"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center justify-center">
              <div className="loader"> <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default UploadPage;