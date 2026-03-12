import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserSearch from './UserSearch';
import './SocialNavBar.css';

const SocialNavBar = ({ onCreateClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const myId = localStorage.getItem('_id');

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { icon: '🏠', label: 'Feed', action: () => navigate('/feed'), path: '/feed' },
        { icon: '🔍', label: 'Search', action: () => setShowSearch(s => !s), path: null },
        { icon: '➕', label: 'Create', action: onCreateClick, path: null },
        { icon: '👤', label: 'Profile', action: () => navigate(`/profile/${myId}`), path: '/profile' },
        { icon: '🌍', label: 'Explore', action: () => navigate('/explore'), path: '/explore' },
    ];

    return (
        <>
            <nav className="social-navbar glass-panel">
                <div className="navbar-brand" onClick={() => navigate('/feed')}>
                    <span className="brand-icon">✈️</span>
                    <span className="brand-name text-gradient">DestiKnow</span>
                </div>

                <div className="navbar-items">
                    {navItems.map(item => (
                        <button
                            key={item.label}
                            className={`nav-item ${item.path && isActive(item.path) ? 'active' : ''}`}
                            onClick={item.action}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {showSearch && <UserSearch onClose={() => setShowSearch(false)} />}
        </>
    );
};

export default SocialNavBar;
