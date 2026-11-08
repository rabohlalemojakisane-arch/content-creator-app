import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ContentDetails() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState({ displayName: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await axios.get(`${process.env.REACT_APP_API_URL}/contents/${id}`);
        setContent(contentRes.data);

        const commentsRes = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${id}`);
        setComments(commentsRes.data);

        const likesRes = await axios.get(`${process.env.REACT_APP_API_URL}/likes/${id}`);
        setLikes(likesRes.data.count);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    const viewerId = localStorage.getItem('viewerId') || Math.random().toString(36).substring(7);
    localStorage.setItem('viewerId', viewerId);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/likes`, { contentId: id, viewerId });
      if (hasLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/comments`, {
        contentId: id,
        displayName: newComment.displayName,
        text: newComment.text
      });
      setComments([response.data, ...comments]);
      setNewComment({ displayName: '', text: '' });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  if (!content) return <div className="container"><h2>Content not found</h2><Link to="/">Go Back</Link></div>;

  return (
    <div className="content-details-page">
      <div className="details-container">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <img src={content.thumbnail} alt={content.title} className="details-image" />
        
        <div className="details-header">
          <span className="card-category">{content.category}</span>
          <h1>{content.title}</h1>
          <p className="meta-info">Published on {content.createdAt.split('T')[0]} | {content.views} views</p>
        </div>

        <div className="details-actions">
          <button onClick={handleLike} className={`action-btn ${hasLiked ? 'liked' : ''}`}>
            {hasLiked ? '❤️ Liked' : '🤍 Like'} ({likes})
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied!');
          }} className="action-btn">
            🔗 Share
          </button>
        </div>

        <div className="details-description">
          <p>{content.description}</p>
          <div className="media-placeholder">
            <p>Media ({content.contentType}) available at: {content.mediaUrl}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          <form className="comment-form" onSubmit={submitComment}>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="comment-input" 
              value={newComment.displayName}
              onChange={(e) => setNewComment({...newComment, displayName: e.target.value})}
              required
            />
            <textarea 
              placeholder="Add a comment..." 
              className="comment-textarea"
              value={newComment.text}
              onChange={(e) => setNewComment({...newComment, text: e.target.value})}
              required
            ></textarea>
            <button type="submit" className="submit-comment-btn">Post Comment</button>
          </form>
          
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment">
                <h4>{comment.displayName}</h4>
                <p className="comment-date">{comment.createdAt.split('T')[0]}</p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDetails;