import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addComment, getComments } from '../../services/socialApiService';
import './CommentsPanel.css';

const CommentsPanel = ({ postId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const listRef = useRef(null);

    const load = useCallback(async (cur) => {
        setLoading(true);
        const res = await getComments(postId, cur);
        setLoading(false);
        if (res.success) {
            setComments(prev => cur ? [...prev, ...res.data.comments] : res.data.comments);
            setCursor(res.data.nextCursor);
            setHasMore(res.data.hasMore);
        }
    }, [postId]);

    useEffect(() => { load(null); }, [load]);

    const handlePost = async () => {
        if (!text.trim() || posting) return;
        setPosting(true);
        const res = await addComment(postId, text.trim());
        setPosting(false);
        if (res.success) {
            setComments(prev => [...prev, res.data.comment]);
            setText('');
            setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 100);
        }
    };

    return (
        <div className="comments-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="comments-panel glass-panel">
                <div className="comments-header">
                    <h4>Comments</h4>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>

                <div className="comments-list" ref={listRef}>
                    {comments.map(c => (
                        <div key={c._id} className="comment-item">
                            <div className="comment-avatar">
                                {c.userId?.avatarUrl
                                    ? <img src={c.userId.avatarUrl} alt="" />
                                    : <div className="avatar-fallback-sm">{(c.userId?.username || 'U')[0].toUpperCase()}</div>
                                }
                            </div>
                            <div className="comment-body">
                                <span className="comment-author">@{c.userId?.username}</span>
                                <p className="comment-text">{c.text}</p>
                                <span className="comment-time">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <button className="load-more-btn" onClick={() => load(cursor)} disabled={loading}>
                            {loading ? 'Loading…' : 'Load more'}
                        </button>
                    )}

                    {!loading && comments.length === 0 && (
                        <p className="no-comments">No comments yet. Be the first! 🌟</p>
                    )}
                </div>

                <div className="comment-input-row">
                    <input
                        className="comment-input"
                        type="text"
                        placeholder="Add a comment…"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handlePost()}
                        maxLength={2200}
                    />
                    <button className="comment-post-btn" onClick={handlePost} disabled={!text.trim() || posting}>
                        {posting ? '…' : '➤'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsPanel;
