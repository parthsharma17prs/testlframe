import {Link, useLocation} from 'react-router-dom';
import ProfileCard from './ProfileCard';

function TopNav({candidateName='Student'})
{
  const location=useLocation();

  const isActive=(path) => location.pathname===path;

  return (
    <nav className="top-nav-premium">
      <div className="nav-premium-container">
        {/* Brand Section */}
        <div className="nav-brand-section">
          <Link to="/tests" className="nav-brand-link">
            <div className="brand-icon">{'<'}/{'>'}</div>
            <div className="brand-text">
              <div className="brand-main">CIDE</div>
              <div className="brand-sub">Editor</div>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <ul className="nav-center-links">
          <li>
            <Link 
              to="/tests" 
              className={`nav-hover-link ${isActive('/tests')?'nav-active':''}`}
            >
              <span className="nav-icon">📝</span>
              <span>Take Test</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/practice" 
              className={`nav-hover-link ${isActive('/practice')?'nav-active':''}`}
            >
              <span className="nav-icon">⚡</span>
              <span>Live Editor</span>
            </Link>
          </li>
        </ul>

        {/* Right Section - Profile */}
        <div className="nav-right-section">
          <ProfileCard name={candidateName} role="Student" />
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
