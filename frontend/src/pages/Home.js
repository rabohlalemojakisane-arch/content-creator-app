import { useState, useEffect } from 'react';
import axios from 'axios';
import ContentCard from '../components/ContentCard';

function Home() {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contents`);
        setContents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContent = contents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading content...</h2>;

  return (
    <div className="home-page">
      <section className="creator-hero">
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" 
          alt="Creator" 
          className="creator-avatar" 
        />
        <h1>Welcome to ROYHUB</h1>
        <p>Hi, I'm ROY! I create content about technology, web development, and travel. Explore my latest videos, articles, and podcasts below.</p>
      </section>

      <section className="content-section">
        <div className="filters">
          <input
            type="text"
            placeholder="Search content by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="category-buttons">
            {['All', 'Technology', 'Education', 'Travel', 'Lifestyle'].map(cat => (
              <button 
                key={cat}
                className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <p className="no-results">No content found.</p>
        ) : (
          <div className="content-grid">
            {filteredContent.map(item => (
              <ContentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;