import React from "react";
import { Link, useParams } from "react-router-dom";
import "./header.css";

const Header = ({ cartCount = 0, searchQuery, setSearchQuery, store }) => {
  const { storeId } = useParams(); // ✅ Get storeId from URL

  return (
    <header className="header">
      {/* 🔹 Left Section: Logo + Store Name + Profile */}
      <div className="header-section left">
        {store?.logo ? (
          <img
            src={`http://localhost:5000${store.logo}`}
            alt="store logo"
            className="store-logo"
          />
        ) : (
          <span className="fallback-logo">🛍️</span>
        )}

        <div className="store-title">
          <h2>{store?.store_name || "Store Name"}</h2>
        </div>

        {/* ✅ Use Link for Profile Navigation */}
        <Link to={`/store/${storeId}/profile`} className="profile-icon" title="Profile">
          🧑
        </Link>
      </div>

      {/* 🔹 Center: Navigation Links */}
      <nav className="header-section center">
        <Link to="/AdminOverview">Home</Link>
        <Link to={`/store/${storeId}/template`}>About</Link>
        <Link to={`/store/${storeId}/cart`}>Cart ({cartCount})</Link>
      </nav>

      {/* 🔹 Right Section: Social Links + Search */}
      <div className="header-section right">
        {store?.facebook && (
          <a href={store.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
            📘
          </a>
        )}
        {store?.instagram && (
          <a href={store.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
            📸
          </a>
        )}

        {/* Search Input */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && console.log("Search:", searchQuery)
            }
          />
          <span>🔍</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
