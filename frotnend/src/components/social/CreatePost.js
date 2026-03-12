import React, { useState, useRef, useCallback } from 'react';
import { createPost } from '../../services/socialApiService';
import './CreatePost.css';

const CreatePost = ({ onClose, onCreated }) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('');
    const [placeId, setPlaceId] = useState('');
    const [placeName, setPlaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);
    const fileInputRef = useRef(null);

    const processFiles = useCallback((newFiles) => {
        const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/')).slice(0, 10 - files.length);
        if (!valid.length) return;
        setFiles(prev => [...prev, ...valid]);
        valid.forEach(f => {
            const reader = new FileReader();
            reader.onload = e => setPreviews(prev => [...prev, e.target.result]);
            reader.readAsDataURL(f);
        });
    }, [files.length]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processFiles(e.dataTransfer.files);
    };

    const removeImage = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
        setImgIdx(i => Math.min(i, previews.length - 2));
    };

    const handleSubmit = async () => {
        if (!files.length) { setError('Add at least one photo'); return; }
        setLoading(true);
        setError('');

        const fd = new FormData();
        files.forEach(f => fd.append('images', f));
        if (caption.trim()) fd.append('caption', caption.trim());
        if (category.trim()) fd.append('category', category.trim());
        if (placeId.trim()) fd.append('placeId', placeId.trim());

        const res = await createPost(fd);
        setLoading(false);
        if (res.success) {
            onCreated(res.data.post);
        } else {
            setError(res.error || 'Failed to create post');
        }
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="create-post-modal glass-panel">
                <div className="modal-header">
                    <h3 className="modal-title">New Post</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Image area */}
                {previews.length === 0 ? (
                    <div
                        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="drop-icon">🖼️</div>
                        <p className="drop-title">Drop photos here</p>
                        <p className="drop-sub">or click to browse · up to 10 images</p>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
                            onChange={e => processFiles(e.target.files)} />
                    </div>
                ) : (
                    <div className="preview-area">
                        <img src={previews[imgIdx]} alt="preview" className="preview-main" />
                        <div className="preview-remove" onClick={() => removeImage(imgIdx)}>✕</div>
                        {previews.length > 1 && (
                            <div className="preview-strip">
                                {previews.map((src, i) => (
                                    <div key={i} className={`preview-thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)}>
                                        <img src={src} alt="" />
                                    </div>
                                ))}
                                {previews.length < 10 && (
                                    <div className="preview-thumb add-more" onClick={() => fileInputRef.current?.click()}>
                                        <span>+</span>
                                        <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
                                            onChange={e => processFiles(e.target.files)} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Caption */}
                <div className="create-input-group">
                    <textarea
                        className="caption-input"
                        placeholder="Write a caption… #adventure #travel"
                        value={caption}
                        onChange={e => setCaption(e.target.value.slice(0, 2200))}
                        maxLength={2200}
                        rows={3}
                    />
                    <span className="caption-counter">{caption.length}/2200</span>
                </div>

                {/* Category */}
                <div className="create-input-group">
                    <select
                        className="create-category-select"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', marginTop: '10px' }}
                    >
                        <option value="">Select a Category (Optional)</option>
                        <option value="adventure">🏔️ Adventure</option>
                        <option value="scenery">🌅 Scenery</option>
                        <option value="restaurant">🍽️ Restaurant</option>
                        <option value="resorts">🏖️ Resorts</option>
                        <option value="games">🎮 Games</option>
                    </select>
                </div>

                {/* Place tag */}
                <div className="create-input-group place-input-group">
                    <span className="place-label">📍</span>
                    <input
                        className="place-input"
                        placeholder="Place name (optional)"
                        value={placeName}
                        onChange={e => setPlaceName(e.target.value)}
                    />
                    <input
                        className="place-id-input"
                        placeholder="Place ID (from URL)"
                        value={placeId}
                        onChange={e => setPlaceId(e.target.value)}
                    />
                </div>

                {error && <p className="create-error">⚠️ {error}</p>}

                <button className="create-submit-btn" onClick={handleSubmit} disabled={loading || !files.length}>
                    {loading ? <span className="btn-spinner" /> : 'Share Post'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
