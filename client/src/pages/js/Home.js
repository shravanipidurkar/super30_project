import React from 'react';
import '../css/Home.css'; // We'll style this in a moment
import { Link } from 'react-router-dom';
import homeImage from '../../images/home-page-icon.jpg';


function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">DUKAANIFY</div>
        <div className="navbar-right">
          <Link to="/login"><button className="btn">Login</button></Link>
          <button className="btn get-started">Get Started</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="content-left">
          <h1>Create Your <br /> Own Website</h1>
          <p>Build your dream product and make your ideas come to life through stunning websites. Build your dream product and make your ideas come to life through stunning websites. Build your dream product and make your ideas come to life through stunning websites.</p>
          <button className="btn get-started">Get Started</button>
        </div>
        <div className="content-right">
        <img 
            src={homeImage} // ✅ Correct image usage
            alt="Landing Visual"
            className="home-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
