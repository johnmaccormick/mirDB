import './HomePage.css';
import '../index.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <h1 className="page-title">MirDB home</h1>
        
        <div className="navigation-grid">
          <div className="nav-card">
            <h2 className="nav-card-title">Characters</h2>
            <p className="nav-card-description">
              View and manage all characters in the novel.
            </p>
            <Link to="/characters" className="btn-link-primary">
              View Characters
            </Link>
          </div>

          {/* Add more navigation cards as you build more pages */}
          <div className="nav-card">
            <h2 className="nav-card-title">Chapters</h2>
            <p className="nav-card-description">
              View info on each chapter in the novel.
            </p>
            <Link to="/chapters" className="btn-link-primary">
              View Chapters
            </Link>
          </div>

          <div className="nav-card">
            <h2 className="nav-card-title">Settings</h2>
            <p className="nav-card-description">
              Configure your application preferences.
            </p>
            <Link to="/settings" className="btn-link-primary">
              Open Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;