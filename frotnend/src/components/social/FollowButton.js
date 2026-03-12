import React, { useState } from 'react';
import { followUser, unfollowUser } from '../../services/socialApiService';
import './FollowButton.css';

const FollowButton = ({ userId, initialIsFollowing, initialStatus, onFollowChange, followersCount }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {
        if (loading) return;
        setLoading(true);
        if (isFollowing) {
            const res = await unfollowUser(userId);
            if (res.success) {
                setIsFollowing(false);
                setStatus(null);
                onFollowChange?.(followersCount - 1, 'unfollow');
            }
        } else {
            const res = await followUser(userId);
            if (res.success) {
                setIsFollowing(true);
                setStatus(res.data.status);
                onFollowChange?.(followersCount + 1, 'follow');
            }
        }
        setLoading(false);
    };

    const label = isFollowing
        ? (status === 'pending' ? 'Requested' : 'Following')
        : 'Follow';

    const cls = isFollowing ? 'follow-btn following' : 'follow-btn';

    return (
        <button className={cls} onClick={handleFollow} disabled={loading}>
            {loading ? <span className="btn-spinner-sm" /> : label}
        </button>
    );
};

export default FollowButton;
