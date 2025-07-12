import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/admin-feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          rating: filterRating,
          page,
          limit: 10,
        },
      });

      setFeedbacks(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [searchTerm, filterRating, page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return <span className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
  };

  if (loading) return <div className="loading">Loading feedback...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="feedback-container">
      <h1>Feedback</h1>

      <div className="feedback-header">
        <input
          type="text"
          placeholder="Search by customer, product or review"
          value={searchTerm}
          onChange={e => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
        />
        <select value={filterRating} onChange={e => {
          setPage(1);
          setFilterRating(e.target.value);
        }}>
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>

      <table className="feedback-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.feedback_id}>
              <td>{formatDate(fb.review_date)}</td>
              <td>{fb.customer_name}</td>
              <td>{fb.product_name}</td>
              <td>{renderStars(fb.rating)} <span>({fb.rating})</span></td>
              <td>{fb.review_description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Feedback;
