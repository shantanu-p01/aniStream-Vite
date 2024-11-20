import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing React Icons for show/hide password

const AuthPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '', // Only used for registration
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state

  // Check for authentication status on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
        setAuthStatus(response.data.status); // Set to 'authenticated' or 'guest'
        
        if (response.data.status === 'authenticated') {
          // Redirect to homepage if user is authenticated
          navigate('/');
        }
      } catch (err) {
        console.log('Not authenticated');
        setAuthStatus('guest');
      }
    };
    checkAuthStatus();
  }, [navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for registration
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData, { withCredentials: true });
      console.log('Registration success:', response);

      if (response.status === 201) {
        // After successful registration, show login form instead of redirecting
        setIsRegistering(false); // Switch to login form
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  // Handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Only email and password are sent for login
      const { email, password } = formData;
      const response = await axios.post('http://localhost:5000/auth/login', { email, password }, { withCredentials: true });
      console.log('Login success:', response);

      if (response.status === 200) {
        // Redirect to home or protected route upon successful login
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      setAuthStatus('guest');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-black/40 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        {authStatus === 'authenticated' ? (
          <div>
            <h3 className="text-center text-lg mb-4">Welcome back!</h3>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-black/20"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-black/20"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold">Password</label>
              <div className="relative flex items-center">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-black/20 pr-10"
                  required
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <p
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-blue-500 cursor-pointer hover:underline"
              >
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;