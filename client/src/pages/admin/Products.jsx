import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showBlockConfirmation } from '../../helper/Sweat';
import { Link } from 'react-router-dom';
import { showToast } from '../../helper/toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus ? false : true;  // Toggle between true and false
    const title = `Do you want to ${newStatus ? 'List' : 'Unlist'} the product?`;

    showBlockConfirmation(title, newStatus, async () => {
      try {
        await axios.put('http://localhost:3000/admin/block_product', { id, status: newStatus });
        fetchProducts();
        toast.success(`Product has been ${newStatus ? 'listed' : 'unlisted'}`);
      } catch (error) {
        console.error('Error blocking product:', error);
        toast.error('Failed to update product status');
      }
    });
  };

  const handleDelete = async (id) => {
    const title = 'Do you want to delete this product?';
    showBlockConfirmation(title, 'delete', async () => {
      try {
        const res = await axios.delete(`http://localhost:3000/admin/delete_product/${id}`);
        if (res.status === 200) {
          setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
          showToast('Product deleted successfully', 'light', 'success');
        } else {
          showToast('Product failed to delete!', 'dark', 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product', 'dark', 'error');
      }
    });
  };

  if (loading) return <p className="text-center text-lg text-gray-600 mt-12">Loading products...</p>;
  if (error) return <p className="text-center text-lg text-red-600 mt-12">{error}</p>;

  return (
    <div className="w-full mx-auto p-6 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl tracking-wider Header">Products List</h1>
        <Link to="/dashboard/add_products" className="button">
<span>          Create Product
</span>       
 </Link>
      </div>

      <table className="min-w-full table-auto font-sans">
        <thead className="bg-[#262525be]">
          <tr>
            <th className="p-4 text-left ">PRODUCT</th>
            <th className="p-4 text-center ">PRICE</th>
            <th className="p-4 text-center ">STATUS</th>
            <th className="p-4 text-center ">STOCK</th>
            <th className="p-4 text-center ">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-[#171616d2] bg-[#171616ae] border-y-4 border-black">
                <td className="p-4 flex items-center gap-4 ">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                  <div>
                    <p className="font-medium ">{product.name.length > 15 ? `${product.name.slice(0, 15)}...` : product.name}</p>
                    <p className="text-sm ">{product.description.length > 90 ? `${product.description.slice(0, 90)}...` : product.description}</p>
                  </div>
                </td>
                <td className="p-4 text-center font-semibold  ">₹{product.price}</td>
                <td className="p-4 text-center ">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${product.status ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {product.status ? 'ACTIVE' : 'BLOCKED'}
                  </span>
                </td>
                <td className="p-4 text-center font-semibold text-blue-600 ">{product.stock}</td>
                <td className="p-4 text-center ">
                  <div className="flex justify-center gap-4 font-Roboto">
                    <Link to={`/dashboard/edit_products/${product._id}`} className="text-white  font-medium bg-blue-500 px-4 rounded-sm">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleBlock(product._id, product.status)}
                      className={`px-4 py-1 text-sm rounded-sm ${product.status ? 'bg-red-500 hover:bg-red-600 text-white font-medium' : 'bg-green-500 font-medium hover:bg-green-600 text-white'}`}
                    >
                      {product.status ? "Block" : "Unblock"}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-white  font-medium bg-red-500 px-4 rounded-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-600">No Products Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
