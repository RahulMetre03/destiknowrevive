import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import SocialNavBar from './SocialNavBar';
import { getFeed } from '../../services/socialApiService';
import './SocialFeed.css';

const categories = [
    { id: '', label: 'All' },
    { id: 'adventure', label: '🏔️ Adventure' },
    { id: 'scenery', label: '🌅 Scenery' },
    { id: 'restaurant', label: '🍽️ Restaurant' },
    { id: 'resorts', label: '🏖️ Resorts' },
    { id: 'games', label: '🎮 Games' },
];

const SocialFeed = () => {
    const [posts, setPosts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const loaderRef = useRef(null);
    const navigate = useNavigate();

    const loadMore = useCallback(async (currentCursor = cursor, currentCategory = selectedCategory) => {
        if (loading || (!hasMore && currentCursor)) return;
        setLoading(true);
        const res = await getFeed(currentCursor, 10, currentCategory);
        setLoading(false);
        if (res.success) {
            setPosts(prev => {
                if (!currentCursor) return res.data.posts; // Reset on category change
                const newPosts = res.data.posts.filter(p => !prev.some(existing => existing._id === p._id));
                return [...prev, ...newPosts];
            });
            setCursor(res.data.nextCursor);
            setHasMore(res.data.hasMore);
        }
    }, [cursor, hasMore, loading, selectedCategory]);

    // Initial load & Reload when category changes
    useEffect(() => {
        setCursor(null);
        setHasMore(true);
        setPosts([]);
        loadMore(null, selectedCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const handlePostCreated = (newPost) => {
        // Only append if it matches current category or if viewing 'All'
        if (selectedCategory === '' || newPost.category === selectedCategory) {
            setPosts(prev => [{ ...newPost, author: { _id: localStorage.getItem('_id'), username: localStorage.getItem('username'), avatarUrl: '' }, isLikedByMe: false }, ...prev]);
        }
        setShowCreate(false);
    };

    const handleLikeToggle = (postId, liked, count) => {
        setPosts(prev => prev.map(p =>
            p._id === postId ? { ...p, isLikedByMe: liked, likesCount: count } : p
        ));
    };

    return (
        <div className="social-feed-page">
            <SocialNavBar onCreateClick={() => setShowCreate(true)} />

            <div className="feed-container">
                {/* Category Filters */}
                <div className="feed-category-filters" style={{ display: 'flex', gap: '8px', padding: '10px', overflowX: 'auto', marginBottom: '15px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                background: selectedCategory === cat.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                                color: 'white',
                                border: selectedCategory === cat.id ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {posts.length === 0 && !loading && (
                    <div className="feed-empty">
                        <div className="feed-empty-icon">🌄</div>
                        <h3>Your feed is empty</h3>
                        <p>Follow some adventurers to see their posts here!</p>
                    </div>
                )}

                {posts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onLikeToggle={handleLikeToggle}
                    />
                ))}

                <div ref={loaderRef} className="feed-loader">
                    {loading && (
                        <div className="feed-spinner">
                            <span /><span /><span />
                        </div>
                    )}
                    {!hasMore && posts.length > 0 && (
                        <p className="feed-end">You're all caught up ✨</p>
                    )}
                </div>
            </div>

            {showCreate && (
                <CreatePost
                    onClose={() => setShowCreate(false)}
                    onCreated={handlePostCreated}
                />
            )}
        </div>
    );
};

export default SocialFeed;
