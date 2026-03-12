import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentsPanel from './CommentsPanel';
import { likePost, unlikePost, deletePost } from '../../services/socialApiService';
import './PostCard.css';

const PostCard = ({ post, onLikeToggle, isMe }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const [liking, setLiking] = useState(false);
    const [showCmts, setShowCmts] = useState(false);
    const [localLiked, setLocalLiked] = useState(post.isLikedByMe);
    const [localCount, setLocalCount] = useState(post.likesCount);
    const doubleTapRef = useRef(null);
    const navigate = useNavigate();

    const author = post.author || post.userId || {};

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        const newLiked = !localLiked;
        setLocalLiked(newLiked);
        setLocalCount(c => newLiked ? c + 1 : Math.max(0, c - 1));

        const res = newLiked ? await likePost(post._id) : await unlikePost(post._id);
        if (res.success) {
            setLocalCount(res.data.likesCount);
            onLikeToggle?.(post._id, res.data.isLiked, res.data.likesCount);
        } else {
            // Revert on failure
            setLocalLiked(!newLiked);
            setLocalCount(c => newLiked ? c - 1 : c + 1);
        }
        setLiking(false);
    };

    const handleDoubleTap = () => {
        if (!localLiked) handleLike();
        if (doubleTapRef.current) {
            doubleTapRef.current.classList.add('heart-burst');
            setTimeout(() => doubleTapRef.current?.classList.remove('heart-burst'), 700);
        }
    };

    const handlePlaceClick = () => {
        if (post.placeId) navigate(`/details?locationId=${post.placeId}`);
    };

    const deleteThisPost = async () => {
        await deletePost(post._id);
    }

    const images = post.images || [];

    return (
        <article className="post-card glass-panel">
            {/* Header */}
            <div className="post-header">
                <div className="post-author" onClick={() => navigate(`/profile/${author._id}`)}>
                    <div className="avatar-ring">
                        {author.avatarUrl
                            ? <img src={author.avatarUrl} alt={author.username} className="avatar-img" />
                            : <div className="avatar-fallback">{(author.username || 'U')[0].toUpperCase()}</div>
                        }
                    </div>
                    <div className="author-info">
                        <span className="author-name">{author.displayName || author.username}</span>
                        <span className="author-handle">@{author.username}</span>
                    </div>
                </div>
                {post.placeId && (
                    <div>
                        <button className="place-tag" onClick={handlePlaceClick}>
                            <span className="place-icon">📍</span>
                            <span>{post.placeName}</span>
                        </button>
                        {isMe && (<button onClick={deleteThisPost}>
                            :
                        </button>)}
                    </div>
                )}
            </div>

            {/* Image carousel */}
            {images.length > 0 && (
                <div className="post-media" onDoubleClick={handleDoubleTap}>
                    <img
                        src={images[imgIdx]?.url}
                        alt={`post-${imgIdx}`}
                        className="post-image"
                        loading="lazy"
                    />
                    <div ref={doubleTapRef} className="heart-overlay">❤️</div>
                    {images.length > 1 && (
                        <>
                            <button className="carousel-btn prev" onClick={() => setImgIdx(i => Math.max(0, i - 1))} disabled={imgIdx === 0}>‹</button>
                            <button className="carousel-btn next" onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))} disabled={imgIdx === images.length - 1}>›</button>
                            <div className="carousel-dots">
                                {images.map((_, i) => <span key={i} className={`dot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />)}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="post-actions">
                <button className={`action-btn like-btn ${localLiked ? 'liked' : ''}`} onClick={handleLike} disabled={liking}>
                    <span className="action-icon">{localLiked ? '❤️' : '🤍'}</span>
                    <span className="action-count">{localCount}</span>
                </button>
                <button className="action-btn comment-btn" onClick={() => setShowCmts(true)}>
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.commentsCount}</span>
                </button>
            </div>

            {/* Caption */}
            {post.caption && (
                <div className="post-caption">
                    <span className="caption-author">@{author.username}</span> {post.caption}
                </div>
            )}

            <div className="post-time">
                {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            {showCmts && <CommentsPanel postId={post._id} onClose={() => setShowCmts(false)} />}
        </article>
    );
};

export default PostCard;
