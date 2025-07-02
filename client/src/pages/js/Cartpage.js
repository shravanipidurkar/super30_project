// src/pages/CartPage.js
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/cart.css';
import { useCart } from '../js/CartContext';
import Header from "../components/header";
import React, { useState, useEffect } from 'react'; 

const CartPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, setCartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate(`/store/${storeId}/login`);
    }
  }, [storeId, navigate]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

 const handleCheckout = () => {
  alert("Thanks for your purchase!");

  // Clear cart
  setCartItems([]);

  // Log out customer
  localStorage.removeItem("customerToken");
  localStorage.removeItem("customerId");
  localStorage.removeItem("customerData");

  // Redirect to login page
  navigate(`/store/${storeId}/login`);
};


  return (
    <div className="cart-container">
      <Header 
        cartCount={cartItems.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <h1 className="cart-title">Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty 🛒</h2>
              <Link to={`/store/${storeId}/template`}>
                <button className="shop-btn">Go Shopping</button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  {item.category && <p>Category: {item.category}</p>}
                  {item.description && <p>{item.description}</p>}
                  <p>Price: ₹{item.price.toLocaleString()}</p>
                  <p>Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                  <div className="quantity-buttons">
                    <button onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>🗑️</button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Summary</h2>
            <p>{cartItems.length} Item(s)</p>
            <p>Total: ₹{total.toLocaleString()}</p>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
