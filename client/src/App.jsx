import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const Banner = lazy(() => import('./pages/admin/Banner'));
const Order = lazy(() => import('./pages/admin/Orders'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const Products = lazy(() => import('./pages/admin/Products'));
const Offers = lazy(() => import('./pages/admin/Offers'));
const Users = lazy(() => import('./pages/admin/Users'));
const Add_Products = lazy(() => import('./pages/admin/add-pages/Add_Product'));
const Home = lazy(() => import('./pages/user/Home'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Shop = lazy(() => import('./pages/user/Shop'));
const Register = lazy(() => import('./pages/user/Register'));
const Login = lazy(() => import('./pages/user/Login'));
const General = lazy(() => import('./components/user/Profile-views/General'));
const Wallet = lazy(() => import('./components/user/Profile-views/Wallet'));
const Address = lazy(() => import('./components/user/Profile-views/Address'));
const Orders = lazy(() => import('./components/user/Profile-views/Orders'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const Wishlist = lazy(() => import('./pages/user/wishlist'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Notfound = lazy(() => import('./pages/user/NotFound'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const ProtectRoute = lazy(() => import('./pages/user/ProtectRoute'));
const Add_address = lazy(() => import('./components/user/Profile-views/Add_address'));
const Edit_address = lazy(() => import('./components/user/Profile-views/Edit_address'));
const SuccessComponent = lazy(() => import('./components/user/SuccessComponent'));
const FailureComponent = lazy(() => import('./components/user/FailureComponent'));
const Order_Details = lazy(() => import('./components/user/Order_Details'));
const Edit_Products = lazy(() => import('./components/user/Products/Edit_Products'));
const Add_Coupons = lazy(() => import('./components/user/Coupons/Add_Coupons'));
const Edit_Categories = lazy(() => import('./components/user/Categories/Edit_Categories'));
const Add_Categories = lazy(() => import('./components/user/Categories/Add_Categories'));
const Add_Categories_Offers = lazy(() => import('./components/user/Offers/Categories_Offers/Add_Categories_Offers'));
const Add_Products_Offers = lazy(() => import('./components/user/Offers/Product_Offers/Add_Product_Offers'));
const Dashboard_Home = lazy(() => import('./pages/admin/Home'));

function App() {
  return (
    <Router>
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* User Routes */}
          
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/register" element={<ProtectRoute isProtectedForLoggedIn={true}><Register /></ProtectRoute>} />
          <Route path="/login" element={<ProtectRoute isProtectedForLoggedIn={true}><Login /></ProtectRoute>} />

          <Route path="/success" element={<SuccessComponent />} />
          <Route path="/failure" element={<FailureComponent />} />

          <Route path="/profile" element={<Profile />}>
          <Route index element={<General />} />      
          <Route path='general' element={<General />} />      
            <Route path="address" element={<Address />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order_details/:id" element={<Order_Details />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="add_address" element={<Add_address />} />
        <Route path="edit_address/:id" element={<Edit_address />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>

          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<Notfound />} />



          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="products" element={<Products />} />
            <Route path="home" element={<Dashboard_Home />} />
            <Route index element={<Dashboard_Home />} />      
            <Route path="categories" element={<Categories />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="brands" element={<Brands />} />
            <Route path="orders" element={<Order />} />
            <Route path="offers" element={<Offers />} />
            <Route path="users" element={<Users />} />
            <Route path="banners" element={<Banner />} />
            <Route path="add_products" element={<Add_Products />} />
            <Route path="add_coupons" element={<Add_Coupons />} />
            <Route path="edit_products/:id" element={<Edit_Products />} />
            <Route path="add_categories" element={<Add_Categories />} />
            <Route path="edit_categories/:id" element={<Edit_Categories />} />
            <Route path="add_categories_offers" element={<Add_Categories_Offers />} />
            <Route path="add_products_offers" element={<Add_Products_Offers />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
