import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, getUserPosts } from '../../services/socialApiService';
import PostCard from './PostCard';
import FollowButton from './FollowButton';
import SocialNavBar from './SocialNavBar';
import CreatePost from './CreatePost';
import './UserProfile.css';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const myId = localStorage.getItem('_id');
    const isMe = myId === userId;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loadProfile = useCallback(async () => {
        const res = await getProfile(userId);
        if (res.success) setUser(res.data.user);
    }, [userId]);

    const loadPosts = useCallback(async (cur) => {
        if (loading) return;
        setLoading(true);
        const res = await getUserPosts(userId, cur, 9);
        setLoading(false);
        if (res.success) {
            setPosts(prev => cur ? [...prev, ...res.data.posts] : res.data.posts);
            setCursor(res.data.nextCursor);
            setHasMore(res.data.hasMore);
        }
    }, [userId, loading]);

    useEffect(() => {
        if (!localStorage.getItem('_id')) { navigate('/'); return; }
        loadProfile();
        loadPosts(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleFollowChange = (newCount, action) => {
        setUser(prev => prev ? { ...prev, followersCount: newCount } : prev);
    };

    const [showCreate, setShowCreate] = useState(false);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [{ ...newPost, author: { _id: localStorage.getItem('_id'), username: localStorage.getItem('username'), avatarUrl: '' }, isLikedByMe: false }, ...prev]);
        setShowCreate(false);
    };

    if (!user) return (
        <div className="profile-page">
            <SocialNavBar onCreateClick={() => setShowCreate(true)} />
            <div className="profile-skeleton">
                <div className="skeleton-avatar" /><div className="skeleton-lines" />
            </div>
        </div>
    );

    const stats = [
        { label: 'Posts', value: user.postsCount },
        { label: 'Followers', value: user.followersCount },
        { label: 'Following', value: user.followingCount },
    ];

    return (
        <div className="profile-page">
            <SocialNavBar onCreateClick={() => setShowCreate(true)} />
            <div className="profile-content">
                {/* Hero */}
                <div className="profile-hero glass-panel">
                    <div className="profile-avatar-wrap">
                        {user.avatarUrl
                            ? <img src={user.avatarUrl} alt={user.username} className="profile-avatar" />
                            : <div className="profile-avatar-fallback">{(user.username || 'U')[0].toUpperCase()}</div>
                        }
                        {user.isVerified && <span className="verified-badge" title="Verified">✓</span>}
                    </div>
                    <div className="profile-meta">
                        <h2 className="profile-displayname">{user.displayName || user.username}</h2>
                        <p className="profile-username">@{user.username}</p>
                        {user.bio && <p className="profile-bio">{user.bio}</p>}
                        {user.city && <p className="profile-city">📍 {user.city}</p>}
                    </div>
                    <div className="profile-stats">
                        {stats.map(s => (
                            <div key={s.label} className="stat-box">
                                <span className="stat-value">{(s.value || 0).toLocaleString()}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                    {!isMe && (
                        <FollowButton
                            userId={userId}
                            initialIsFollowing={user.isFollowedByMe}
                            initialStatus={user.followStatus}
                            onFollowChange={handleFollowChange}
                            followersCount={user.followersCount}
                        />
                    )}
                    {isMe && (
                        <button className="edit-profile-btn" onClick={() => alert('Edit profile coming soon!')}>
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Posts grid */}
                <div className="profile-posts-section">
                    <h4 className="section-label">Posts</h4>
                    {posts.length === 0 && !loading && (
                        <div className="no-posts">
                            <p>No posts yet {isMe ? '— share your first adventure!' : ''}</p>
                        </div>
                    )}
                    <div className="posts-grid">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} isMe={isMe} />
                        ))}
                    </div>
                    {hasMore && (
                        <button className="load-more-btn" onClick={() => loadPosts(cursor)} disabled={loading}>
                            {loading ? 'Loading…' : 'Load more'}
                        </button>
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

export default UserProfile;
