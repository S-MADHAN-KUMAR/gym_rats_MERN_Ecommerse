import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Button from '../../components/Button';

const Dashboard = () => {
  return (
    <div className='flex overflow-x-hidden bg-[#060606] w-full h-screen text-[#e8e8e8]'>
      {/* Sidebar */}
      <aside className='fixed hidden sm:flex flex-col justify-between items-center bg-[#3836364e] w-[200px] h-full py-8 px-4 uppercase font-semibold text-xl'>
        <a href='/dashboard/home' className='text-4xl Header tracking-widest'>Dashboard</a>
        
        {/* Links */}
        <div className="flex flex-col gap-7">
          <Link to="/dashboard/users" className="text-lg hover:text-[#b88cff]">Users</Link>
          <Link to="/dashboard/products" className="text-lg hover:text-[#b88cff]">Products</Link>
          <Link to="/dashboard/coupons" className="text-lg hover:text-[#b88cff]">Coupons</Link>
          <Link to="/dashboard/brands" className="text-lg hover:text-[#b88cff]">Brands</Link>
          <Link to="/dashboard/banners" className="text-lg hover:text-[#b88cff]">Banners</Link>
          <Link to="/dashboard/orders" className="text-lg hover:text-[#b88cff]">Orders</Link>
          <Link to="/dashboard/categories" className="text-lg hover:text-[#b88cff]">Categories</Link>
          <Link to="/dashboard/offers" className="text-lg hover:text-[#b88cff]">Offers</Link>
        </div>

        {/* Logout Button */}
<Button label='LOGOUT'/>

      </aside>

      {/* Main content */}
      <div className="flex-grow ml-[200px] p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
