import { Link } from 'react-router-dom';

function ContentCard({ item }) {
  return (
    <div className="content-card">
      <img src={item.thumbnail} alt={item.title} className="card-image" />
      <div className="card-body">
        <span className="card-category">{item.category}</span>
        <h3>{item.title}</h3>
        <p className="card-type">{item.contentType}</p>
        <Link to={`/content/${item._id}`} className="card-btn">
          View Content
        </Link>
      </div>
    </div>
  );
}

export default ContentCard;