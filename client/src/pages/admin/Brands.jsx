import React, { useEffect, useState } from 'react';
import { fetchBrands } from '../../api/brand.js';

const Brands = () => {
  const [Brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const BrandsData = await fetchBrands();
        setBrands(BrandsData);
      } catch (err) {
        setError('Failed to fetch Brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsData();
  }, []);

  const data = Brands.map((brand) => ({
    image: brand?.imageUrl || 'No image available',
    name: brand?.name,
    status: brand?.status,
    actions: ['edit', 'block'],
  }));

  const header = ['Image', 'Name', 'Status', 'Actions'];

  if (loading) {
    return <div className="text-gray-500">Loading Brands...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="Header tracking-wider text-5xl mb-8">Brands List</h1>
    </div>
  );
};

export default Brands;
