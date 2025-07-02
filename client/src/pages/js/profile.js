import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerProfile = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customerToken');

    if (!token) {
      // Not logged in → redirect to login
      navigate(`/store/${storeId}/login`);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(response.data.customer);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setError('Unable to fetch customer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [storeId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerData');
    navigate(`/store/${storeId}/login`);
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!customer) return <div style={styles.error}>Customer not found.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Customer Profile</h2>
      <div style={styles.card}>
        <p><strong>Name:</strong> {customer.customer_name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone_number}</p>
        <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
        <p><strong>Store ID:</strong> {customer.store_id}</p>
        <p><strong>Date Joined:</strong> {new Date(customer.date_joined).toLocaleDateString()}</p>
      </div>
      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '2rem auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  card: {
    lineHeight: '1.8',
    fontSize: '1rem',
    color: '#444',
  },
  logoutButton: {
    marginTop: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.1rem',
    color: 'red',
  },
};

export default CustomerProfile;
