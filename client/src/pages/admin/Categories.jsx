import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/category';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/admin/get_all_categories')
        if(res.status == 200){

          setCategories(res.data);
        }
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



  if (loading) {
    return <div className="text-gray-500">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <h1 className="text-5xl tracking-wider Header">Categories List</h1>
      <a href="/dashboard/add_categories" className="button">
        <span> + Add Categories </span>
      </a>
    </div>

    {/* Table Section */}
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-center text-sm">
        {/* Table Head */}
        <thead className="th pop uppercase tracking-wider">
          <tr>

            <th className="p-4">Category Image</th>
            <th className="p-4">Category Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <tr key={index} className="tb border-y-2 border-black">
                <td className="p-4">
                  <img src={category.imageUrl} className="w-40" />
                </td>
                <td className="p-4">{category.name}</td>
                <td className="p-4">
                    <span
                      className={`px-8 py-2 font-semibold uppercase ${
                        category.status === true
                          ? "text-white bg-green-600"
                          : "text-white bg-red-600"
                      }`}
                    >
                      {category.status === true ? "Active" : "Blocked"}
                    </span>
                  </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      toggleCouponStatus(category._id, category.status)
                    }
                    className={`px-8 py-2 font-semibold uppercase ${
                      category.status
                        ? "text-white bg-red-600"
                        : "text-white bg-green-600"
                    }`}
                  >
                    {category.status ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No coupons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Categories;
