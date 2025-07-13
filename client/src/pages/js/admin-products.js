import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/admin-products.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListView, setIsListView] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '', endDate: '', category: '',
    minPrice: '', maxPrice: '', minSold: '', maxSold: ''
  });

  const navigate = useNavigate();
  const API = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

  // Centralized token getter
  const token = localStorage.getItem('authToken');

  // Unified fetch options
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    // Check token exists
    if (!token) {
      alert('Not authenticated — please log in.');
      return navigate('/login');
    }

    if (!isFiltered) fetchProducts();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`, axiosConfig);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch products failed:', err);
      handleAuthError(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/products/category-counts`, axiosConfig);
      const totalCount = res.data.reduce((sum, c) => sum + c.count, 0);
      setCategories([{ name: 'All', count: totalCount }, ...res.data]);
    } catch (err) {
      console.error('Fetch categories failed:', err);
      handleAuthError(err);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      const params = {
        category: filters.category || (activeCategory !== 'All' ? activeCategory : ''),
        search: searchTerm,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minSold: filters.minSold,
        maxSold: filters.maxSold
      };
      const res = await axios.get(`${API}/api/products/filter`, {
        ...axiosConfig,
        params
      });
      setProducts(res.data);
      setIsFiltered(true);
    } catch (err) {
      console.error('Fetch filtered failed:', err);
      handleAuthError(err);
    }
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('Session expired or unauthorized – please log in again.');
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const clearFilters = () => {
    setFilters({ startDate:'',endDate:'',category:'',minPrice:'',maxPrice:'',minSold:'',maxSold:'' });
    setIsFiltered(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    if (isFiltered) return true;
    return (
      (product.product_name || '')
        .toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === 'All' || product.product_category === activeCategory)
    );
  });

  return (
    <div className="products-container">
      <h1>Products</h1>

      {/* Search & Actions */}
      <div className="products-header">
        <input
          type="text" placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="products-actions">
          <button onClick={() => setShowFilterDialog(true)}>Filter</button>
          <button onClick={() => navigate('/add-product')}>+ Add New Product</button>
        </div>
      </div>

      {/* Categories */}
      <div className="category-bar">
        <div className="category-scroll">
          {categories.map(cat => (
            <button
              key={cat.name}
              className={activeCategory === cat.name ? 'active category-btn' : 'category-btn'}
              onClick={() => {
                setActiveCategory(cat.name);
                if (!isFiltered) fetchProducts();
              }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
        <div className="category-actions">
          <button>+ Add Category</button>
          <button onClick={() => setIsListView(!isListView)}>
            {isListView ? '🗂️ Table View' : '📋 List View'}
          </button>
        </div>
      </div>

      {/* Display */}
      {isListView ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.product_id}>
              <img
                src={`${API}/${product.image_url}`}
                alt={product.product_name}
                onError={e => e.target.src = '/placeholder.png'}
              />
              <h3>{product.product_name}</h3>
              <p className="category">{product.product_category || 'No Category'}</p>
              <p className="price">₹{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th><th>Category</th><th>Price</th>
              <th>Description</th><th>Stock Qty</th><th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.product_id}>
                <td>{p.product_name}</td>
                <td>{p.product_category || '-'}</td>
                <td>₹{p.price}</td>
                <td>{p.description || '-'}</td>
                <td>{p.stock_quantity ?? '-'}</td>
                <td>{p.total_sold ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Filter Modal */}
      {showFilterDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Filter Products</h2>
            <button onClick={() => setShowFilterDialog(false)}>×</button>
            {/* Date Range */}
            <label>Date Created</label>
            <div>
              <input type="date" value={filters.startDate}
                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
              />
              <span>→</span>
              <input type="date" value={filters.endDate}
                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            {/* Category */}
            <label>Category</label>
            <select value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select</option>
              {categories.filter(c => c.name !== 'All').map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            {/* Price */}
            {/* Sold */}
            <div className="modal-actions">
              <button onClick={() => { fetchFilteredProducts(); setShowFilterDialog(false); }}>
                Apply
              </button>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
