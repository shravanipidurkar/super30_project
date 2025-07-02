// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/js/Home';
import Login from "./pages/js/login";
import SignUp from "./pages/js/signup";
import AdminOverview from './pages/js/admin-overview';
import AddOrder from './pages/js/addOrders';
import AddProduct from './pages/js/addProducts';
import AddCustomer from './pages/js/addCustomer';
// import AddCustomer from './pages/js/addCustomer';
import reportWebVitals from './reportWebVitals';
import Template from './pages/js/template';
// Correct path to your component

import CartPage from './pages/js/Cartpage';
import { CartProvider } from './pages/js/CartContext'; 
import Customer_Login from './pages/js/Customer_Login'; 
import Customer_Signup from './pages/js/Customer_Signup';
import CustomerProfile from './pages/js/profile'; 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addorder" element={<AddOrder />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/addcustomer" element={<AddCustomer />} />
        <Route path="/AdminOverview" element={<AdminOverview />} />
        <Route path="/store/:storeId/template" element={<Template />} />
       
        <Route path="store/:storeId/cart" element={<CartPage />} />
        <Route path="/store/:storeId/login" element={<Customer_Login />} />
  <Route path="/store/:storeId/signup" element={<Customer_Signup />} />
  <Route path="/store/:storeId/profile" element={<CustomerProfile />} />
    
      </Routes>
    </BrowserRouter>
  </CartProvider>
</React.StrictMode>

);

reportWebVitals();
