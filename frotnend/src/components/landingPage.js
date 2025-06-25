// TravelLandingPage.js
import React, { useState } from 'react';
import { Eye, EyeOff, Mountain, Plane, MapPin, Loader2 } from 'lucide-react';
import './landing.css';
import apiService from '../services/apiServices';
import { useNavigate } from 'react-router-dom';

// API Service
// const API_BASE_URL = 'http://localhost:5000/api';


export default function TravelLandingPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    city: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.city) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        // Login logic
        const loginData = {
          username: formData.username,
          password: formData.password
        };
        
        const result = await apiService.checkLogin(loginData);
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Login successful! Welcome back!' });
          // Handle successful login (redirect, store token, etc.)
          console.log('Login successful:', result.data);
          localStorage.setItem('username', result.data.username);
  localStorage.setItem('name', result.data.name);
  localStorage.setItem('city', result.data.city);
          navigate('/explore');
        } else {
          setMessage({ type: 'error', text: result.error || 'Login failed. Please try again.' });
        }
      } else {
        // Registration logic
        const registerData = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city
        };
        
        const result = await apiService.registerUser(registerData);
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Registration successful! Welcome to our travel community!' });
          // Handle successful registration
          console.log('Registration successful:', result.data);
          // Optionally switch to login form
          // setIsLogin(true);
        } else {
          setMessage({ type: 'error', text: result.error || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' });
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      city: ''
    });
  };

  return (
    <div className="travel-container">
      {/* Animated Background */}
      <div className="travel-background">
        <div className="travel-overlay"></div>
        
        {/* Floating Elements */}
        <div className="floating-icon floating-icon-1">
          <Mountain size={48} />
        </div>
        <div className="floating-icon floating-icon-2">
          <Plane size={40} />
        </div>
        <div className="floating-icon floating-icon-3">
          <MapPin size={32} />
        </div>
        <div className="floating-icon floating-icon-4">
          <Mountain size={64} />
        </div>
        
        {/* Animated Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="travel-content">
        {/* Hero Text */}
        <div className="hero-section">
          <h1 className="hero-title">
            <div className="hero-main-text">
              Nowhere to go?
            </div>
            <div className="hero-sub-text">
              Know where to go!
            </div>
          </h1>
          <p className="hero-description">
            Discover breathtaking destinations and create unforgettable memories with
          </p>
          <p className='mainmaintext'>
          <b>DESTIKNOW</b>
          </p>
        </div>

        {/* Login/Register Form */}
        <div className="form-container">
          {/* Toggle Buttons */}
          <div className="toggle-container">
            <button
              onClick={() => !isLoading && handleToggleMode()}
              disabled={isLoading}
              className={`toggle-button ${isLogin ? 'toggle-active-login' : 'toggle-inactive'}`}
            >
              Login
            </button>
            <button
              onClick={() => !isLoading && handleToggleMode()}
              disabled={isLoading}
              className={`toggle-button ${!isLogin ? 'toggle-active-register' : 'toggle-inactive'}`}
            >
              Register
            </button>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
              {message.text}
            </div>
          )}

          {/* Form Fields */}
          <div className="form-fields">
            {/* Username/Email for Login */}
            {isLogin ? (
              <div className="input-container">
                <input
                  type="text"
                  name="username"
                  placeholder="Username or Email"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            ) : (
              <>
                {/* Registration Fields */}
                <div className="input-container">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-container">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </>
            )}

            {/* Password Field */}
            <div className="input-container password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`submit-button ${isLogin ? 'submit-login' : 'submit-register'} ${isLoading ? 'submit-disabled' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="loading-spinner" />
                  {isLogin ? 'Logging in...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Start Your Journey' : 'Join the Adventure'
              )}
            </button>
          </div>

          {/* Additional Links */}
          {isLogin && (
            <div className="forgot-password">
              <button className="forgot-password-link">
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <div className="footer-text">
          <p>Your next adventure awaits • Explore • Dream • Discover</p>
        </div>
      </div>
    </div>
  );
}