import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { registerUser, checkLogin } from '../services/apiServices';
import apiService from '../services/apiServices';
import './landing.css';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    city: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        if (!formData.username || !formData.password) {
          setError(true);
          setMessage("Username and password required");
          setLoading(false);
          return;
        }

        const response = await apiService.checkLogin({
          username: formData.username,
          password: formData.password
        });

        if (!response.success) {
          setError(true);
          setMessage(response.error || "Invalid username or password");
          setLoading(false);
          return;
        }

        setError(false);
        setError(false);
        setMessage("Welcome back! Redirecting...");
        localStorage.setItem("username", response.data.username || formData.username); // Fallback to form data
        if (response.data && response.data.city) {
          localStorage.setItem("city", response.data.city);
          localStorage.setItem("_id", response.data._id);
        }
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        setTimeout(() => navigate('/explore'), 1000);

      } else {
        if (!formData.username || !formData.email || !formData.phone || !formData.city || !formData.password) {
          setError(true);
          setMessage("All fields are required");
          setLoading(false);
          return;
        }

        const response = await apiService.registerUser(formData);

        if (!response.success) {
          setError(true);
          setMessage(response.error || "Failed to create account");
          setLoading(false);
          return;
        }

        setError(false);
        setMessage("Account created! Please log in.");
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ ...formData, password: '' });
          setMessage('');
        }, 1500);
      }
    } catch (err) {
      setError(true);
      setMessage(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Immersive Background */}
      <div className="landing-bg-image"></div>
      <div className="landing-bg-overlay"></div>

      {/* Floating Badges */}
      <div className="floating-badges">
        <div className="float-badge badge-1">
          <div className="icon">📍</div> Explore Pune
        </div>
        <div className="float-badge badge-2">
          <div className="icon">🌟</div> 4.9 Top Rated
        </div>
        <div className="float-badge badge-3">
          <div className="icon">🍹</div> Nightlife
        </div>
      </div>

      <div className="landing-content">

        {/* Left Side: Hero */}
        <div className="hero-section">
          <div className="hero-badge">
            <div className="pulse"></div> Next-Gen Travel
          </div>
          <h1 className="hero-title">
            Discover the <br />
            <span className="text-gradient">Undiscovered.</span>
          </h1>
          <p className="hero-description">
            Experience the world's most breathtaking locations, immersive
            adventures, and vibrant nightlife, tailored exactly to your vibe.
          </p>
        </div>

        {/* Right Side: Glass Auth Form */}
        <div className="auth-container">
          <div className="auth-card glass-panel">

            <div className="auth-toggle" data-active={isLogin ? 'login' : 'register'}>
              <div className="toggle-highlighter"></div>
              <button
                type="button"
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setMessage(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setMessage(''); }}
              >
                Create Account
              </button>
            </div>

            {message && (
              <div className={`auth-message ${error ? 'error' : 'success'}`}>
                {error ? '⚠️' : '✨'} {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Login Fields */}
              {isLogin ? (
                <>
                  <div className="input-group stagger-1">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="auth-input"
                      autoComplete="username"
                    />
                  </div>
                </>
              ) : (
                /* Register Fields */
                <>
                  <div className="input-group stagger-1">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="auth-input"
                      autoComplete="username"
                    />
                  </div>
                  <div className="input-group stagger-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="auth-input"
                      autoComplete="email"
                    />
                  </div>
                  <div className="input-group stagger-3">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="auth-input"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="input-group stagger-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="auth-input"
                      autoComplete="address-level2"
                    />
                  </div>
                </>
              )}

              {/* Shared Password Field */}
              <div className={`input-group ${isLogin ? 'stagger-2' : 'stagger-5'}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>

              <button
                type="submit"
                className={`auth-submit ${!isLogin ? 'register-mode' : ''} stagger-5`}
                disabled={loading}
              >
                {loading ? 'Accessing...' : (isLogin ? 'Enter' : 'Join Now')}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;