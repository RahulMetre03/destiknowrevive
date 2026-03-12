import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../services/socialApiService';
import './UserSearch.css';

const UserSearch = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const debounce = useRef(null);

    const handleSearch = (q) => {
        setQuery(q);
        clearTimeout(debounce.current);
        if (!q.trim()) { setResults([]); return; }
        debounce.current = setTimeout(async () => {
            setLoading(true);
            const res = await searchUsers(q);
            setLoading(false);
            if (res.success) setResults(res.data.users);
        }, 300);
    };

    const handleSelect = (userId) => {
        navigate(`/profile/${userId}`);
        onClose();
    };

    return (
        <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="search-panel glass-panel">
                <div className="search-header">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search people…"
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        autoFocus
                    />
                    <button className="search-close" onClick={onClose}>✕</button>
                </div>

                <div className="search-results">
                    {loading && <div className="search-loading">Searching…</div>}
                    {!loading && results.length === 0 && query && (
                        <div className="search-empty">No users found for "{query}"</div>
                    )}
                    {results.map(u => (
                        <div key={u._id} className="search-result-item" onClick={() => handleSelect(u._id)}>
                            <div className="result-avatar">
                                {u.avatarUrl
                                    ? <img src={u.avatarUrl} alt={u.username} />
                                    : <div className="avatar-fallback-sm">{(u.username || 'U')[0].toUpperCase()}</div>
                                }
                            </div>
                            <div className="result-info">
                                <span className="result-name">{u.displayName || u.username}</span>
                                <span className="result-handle">@{u.username}</span>
                            </div>
                            <span className="result-followers">{u.followersCount} followers</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserSearch;
