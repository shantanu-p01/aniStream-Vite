import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

const UserProfileModal = ({ user, isOpen, onClose, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear user state and close modal
        setUser(null);
        onClose();
        // Redirect to home page
        navigate('/');
        window.location.reload();
        // Optionally, you can add a toast or notification here
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1a1818] rounded-xl shadow-xl w-96 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="avatar ring-2 ring-blue-500 rounded-full mb-4">
            <div className="w-24 rounded-full">
              <h1 className="flex items-center justify-center h-full font-semibold text-4xl bg-black/50 text-white">
                {user.username.charAt(0).toUpperCase()}
              </h1>
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-semibold text-white mb-2">{user.username}</h2>
          <p className="text-white/80 mb-6">{user.email}</p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-error w-full bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;