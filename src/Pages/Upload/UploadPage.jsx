import React, { useState, useEffect } from 'react';
import { BiSolidTrash } from "react-icons/bi";

const UploadPage = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [poster, setPoster] = useState(null); // State for poster
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [animeName, setAnimeName] = useState('');
  const [episodeName, setEpisodeName] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [description, setDescription] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // State for loader
  const [isLoading, setIsLoading] = useState(true); // Loader state

  // Simulate loading for 1 second when routed
  useEffect(() => {
    // Disable scrolling when loading
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';

    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 1 second
    }, 500);

    return () => {
      clearTimeout(timer); // Clean up the timer
      document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled after unmount
    };
  }, [isLoading]);

  const handleFileChange = (e, setFile, isVideo = false) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (isVideo) setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e, setFile, isVideo = false) => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } }, setFile, isVideo);
  };

  const handleUpload = () => {
    const emptyFields = [];
    if (!animeName) emptyFields.push('Anime Name');
    if (!episodeNumber) emptyFields.push('Episode Number');
    if (!thumbnail) emptyFields.push('Thumbnail');
    if (!video) emptyFields.push('Video');

    if (emptyFields.length) {
      setModalMessage(emptyFields.length === 4 ? 'All required fields are empty.' : 'The following required fields are empty:');
      setMissingFields(emptyFields.length === 4 ? [] : emptyFields);
      setShowModal(true);
    } else if (!episodeName || !description) {
      setModalMessage('The optional fields are not filled. Do you want to continue?');
      setShowConfirmation(true); // Show confirmation modal
    } else {
      // Perform upload logic for all fields being filled
      showLoaderAndSuccess();
    }
  };

  const handleConfirmUpload = () => {
    // Show loader first, then show success modal after 2 seconds
    showLoaderAndSuccess();
  };

  const showLoaderAndSuccess = () => {
    setLoading(true); // Show loader
    setShowConfirmation(false); // Hide confirmation modal
    setTimeout(() => {
      clearFields();
      setLoading(false); // Hide loader
      setModalMessage('Success! Episode uploaded successfully.');
      setShowSuccessModal(true); // Show success modal
    }, 2000); // 2-second delay before showing the success message
  };

  const clearFields = () => {
    setThumbnail(null);
    setPoster(null); // Clear poster
    setVideo(null);
    setVideoURL('');
    setAnimeName('');
    setEpisodeName('');
    setEpisodeNumber('');
    setDescription('');
  };

  const handleDiscard = () => {
    if (!animeName && !episodeName && !episodeNumber && !description && !thumbnail && !poster && !video) {
      setModalMessage('All fields are already empty');
      setShowModal(true);
    } else {
      clearFields();
    }
  };

  const renderUploadSection = (label, file, setFile, accept, isVideo = false) => (
    <div className='flex-1 flex flex-col items-center justify-center'>
      <div className='flex justify-between items-center w-full lg:max-w-md min-w-[200px] mb-2'>
        <h2 className='text-white text-lg font-bold text-center lg:text-left'>{`Upload ${label}`}</h2>
        {file && (
          <button onClick={() => { setFile(null); if (isVideo) setVideoURL(''); }} className='btn btn-ghost min-h-fit h-fit p-2 text-red-500 text-2xl'>
            <BiSolidTrash size="24" />
          </button>
        )}
      </div>
      <div
        className='relative w-full lg:max-w-md min-w-[200px] h-56 overflow-hidden rounded-lg border-2 border-dashed border-gray-600 bg-black/30 flex items-center justify-center cursor-pointer group'
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, setFile, isVideo)}
      >
        {!file ? (
          <>
            <input type='file' accept={accept} className='hidden' id={`${label.toLowerCase()}-upload`} onChange={(e) => handleFileChange(e, setFile, isVideo)} />
            <label htmlFor={`${label.toLowerCase()}-upload`} className='w-full text-center h-full flex items-center justify-center text-white cursor-pointer'>
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

  return (
    <>
      {isLoading ? ( // Show loader while loading
      <div className="flex justify-center items-center min-h-svh">
        <span className="loading loading-dots loading-md"></span>
      </div>
      ) : (
      <main className='pt-28 p-2 min-h-screen h-full w-full'>
        <div className='flex flex-col h-full lg:flex-row items-center justify-center gap-4 max-w-5xl mx-auto p-2 bg-black/20 rounded-lg'>
          <div className='w-full lg:w-1/2 flex flex-row flex-wrap items-center justify-center gap-4'>
            <div className='w-full flex flex-col md:flex-row gap-4'>
              {renderUploadSection('Thumbnail', thumbnail, setThumbnail, 'image/*')}
              {renderUploadSection('Poster (Optional)', poster, setPoster, 'image/*')} {/* Added poster input */}

            </div>
            {renderUploadSection('Video', video, setVideo, 'video/*', true)}
          </div>
          <div className='w-full lg:w-1/2 flex flex-col gap-4 flex-1'>
            <div className='bg-black/20 p-4 rounded-lg flex-1'>
              <h2 className='text-white text-lg font-bold text-center lg:text-left mb-2'>Episode Details</h2>
              {[ 
                { label: 'Anime Name', value: animeName, onChange: setAnimeName },
                { label: 'Episode Name (Optional)', value: episodeName, onChange: setEpisodeName },
                { label: 'Episode Number', value: episodeNumber, onChange: setEpisodeNumber },
                { label: 'Description (Optional)', value: description, onChange: setDescription, isTextarea: true },
              ].map(({ label, value, onChange, isTextarea }) => (
                <div className='mb-4' key={label}>
                  <label className='block text-white text-sm font-bold mb-2'>{label}</label>
                  {isTextarea ? (
                    <textarea value={value} onChange={(e) => onChange(e.target.value)} className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500' rows='4' />
                  ) : (
                    <input type='text' value={value} onChange={(e) => onChange(e.target.value)} className='w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:border-blue-500' />
                  )}
                </div>
              ))}
              <div className='flex flex-row items-center gap-2'>
                <button onClick={handleUpload} className='btn btn-info w-1/2 text-white font-bold py-2 px-4 rounded-lg'>Upload</button>
                <button onClick={handleDiscard} className='btn btn-error w-1/2 text-white font-bold py-2 px-2 rounded-lg'>Discard</button>
              </div>
            </div>
          </div>
        </div>

          {/* Modal for missing fields */}
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

          {/* Confirmation modal */}
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

          {/* Success modal */}
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

        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center justify-center">
              <div className="loader"> <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
          </div>
        )}
      </main>
      )}
    </>
  );
};

export default UploadPage;
