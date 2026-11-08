import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [contents, setContents] = useState([]);
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({ totalContent: 0, published: 0, drafts: 0, comments: 0 });
  const [activeTab, setActiveTab] = useState('content'); 
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const initialFormState = {
    title: '', description: '', category: 'Technology', contentType: 'Video',
    thumbnail: '', mediaUrl: '', status: 'Draft', publicationDate: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, config);
        setStats(statsRes.data);

        const contentsRes = await axios.get(`${process.env.REACT_APP_API_URL}/contents/all`, config);
        setContents(contentsRes.data);

        const commentsRes = await axios.get(`${process.env.REACT_APP_API_URL}/comments/admin/all`, config);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchDashboardData();
  }, [token, navigate, config]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/contents/${editingId}`, formData, config);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/contents`, formData, config);
      }
      
      const contentsRes = await axios.get(`${process.env.REACT_APP_API_URL}/contents/all`, config);
      setContents(contentsRes.data);
      const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, config);
      setStats(statsRes.data);
      
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (content) => {
    setFormData(content);
    setEditingId(content._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/contents/${id}`, config);
        setContents(contents.filter(c => c._id !== id));
        const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, config);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleUpdateCommentStatus = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/comments/${id}`, { status: newStatus }, config);
      setComments(comments.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm("Delete this comment permanently?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${id}`, config);
        setComments(comments.filter(c => c._id !== id));
        const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, config);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        {activeTab === 'content' && (
          <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(initialFormState); }}>
            {showForm ? 'Cancel' : '+ Add New Content'}
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card"><h3>Total Content</h3><p>{stats.totalContent}</p></div>
        <div className="stat-card"><h3>Published</h3><p>{stats.published}</p></div>
        <div className="stat-card"><h3>Drafts</h3><p>{stats.drafts}</p></div>
        <div className="stat-card"><h3>Comments</h3><p>{stats.comments}</p></div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'content' ? '3px solid #e94560' : 'none', fontWeight: 'bold', cursor: 'pointer', color: activeTab === 'content' ? '#e94560' : '#666' }}
          onClick={() => setActiveTab('content')}
        >
          Manage Content
        </button>
        <button 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'comments' ? '3px solid #e94560' : 'none', fontWeight: 'bold', cursor: 'pointer', color: activeTab === 'comments' ? '#e94560' : '#666' }}
          onClick={() => setActiveTab('comments')}
        >
          Moderate Comments
        </button>
      </div>

      {activeTab === 'content' && (
        <>
          {showForm && (
            <div className="dashboard-form-container">
              <h2>{editingId ? 'Edit Content' : 'Add New Content'}</h2>
              <form onSubmit={handleSubmit} className="dashboard-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Travel">Travel</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Content Type</label>
                    <select name="contentType" value={formData.contentType} onChange={handleInputChange}>
                      <option value="Video">Video</option>
                      <option value="Article">Article</option>
                      <option value="Image">Image</option>
                      <option value="Podcast">Podcast</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>
                {formData.status === 'Scheduled' && (
                  <div className="form-group">
                    <label>Publication Date</label>
                    <input type="date" name="publicationDate" value={formData.publicationDate || ''} onChange={handleInputChange} required />
                  </div>
                )}
                <div className="form-group">
                  <label>Thumbnail Image URL</label>
                  <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} placeholder="https://..." required />
                </div>
                <div className="form-group">
                  <label>Media URL / Content Link</label>
                  <input type="url" name="mediaUrl" value={formData.mediaUrl} onChange={handleInputChange} placeholder="https://..." required />
                </div>
                <button type="submit" className="save-btn">{editingId ? 'Update Content' : 'Save Content'}</button>
              </form>
            </div>
          )}

          <div className="content-table-container">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.map(item => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.contentType}</td>
                    <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td>{item.views}</td>
                    <td className="action-cell">
                      <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'comments' && (
        <div className="content-table-container">
          <table className="content-table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Name</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment._id}>
                  <td>{comment.contentId?.title || 'Deleted Content'}</td>
                  <td>{comment.displayName}</td>
                  <td>{comment.text}</td>
                  <td>
                    <span className={`status-badge ${comment.status.toLowerCase()}`}>{comment.status}</span>
                  </td>
                  <td className="action-cell">
                    {comment.status !== 'Approved' && (
                      <button onClick={() => handleUpdateCommentStatus(comment._id, 'Approved')} className="edit-btn" style={{background: 'green'}}>Approve</button>
                    )}
                    {comment.status !== 'Hidden' && (
                      <button onClick={() => handleUpdateCommentStatus(comment._id, 'Hidden')} className="edit-btn" style={{background: 'gray'}}>Hide</button>
                    )}
                    <button onClick={() => handleDeleteComment(comment._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;