import React, { useEffect, useState } from 'react';
import { MdStar } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { fetchNewArrivals } from '../../api/product.js';


const Aside = ({ setFilter, filter }) => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetchNewArrivals(setNewArrivals);
  }, []);

  return (
    <div className="h-full h1">
      <div className="w-[260px] h-full flex flex-col items-center py-5 gap-4">
        {/* Sort */}
        <div className="rounded-[20px] bg-white w-11/12 mt-3 shadow flex flex-col">
          <h1 className="font-Roboto tracking-wider border-b font-medium text-xl p-4">Sort</h1>
          <div className="tracking-wider text-sm font-medium font-Roboto p-4 flex flex-col gap-y-3 text-gray-600">
            <p
              onClick={() => setFilter('Popularity')}
              className={`cursor-pointer ${filter === 'Popularity' ? 'text-blue-500' : ''}`}
            >
              Popularity
            </p>
            <p
              onClick={() => setFilter('LowToHigh')}
              className={`cursor-pointer ${filter === 'LowToHigh' ? 'text-blue-500' : ''}`}
            >
              Price: Low to High
            </p>
            <p
              onClick={() => setFilter('HighToLow')}
              className={`cursor-pointer ${filter === 'HighToLow' ? 'text-blue-500' : ''}`}
            >
              Price: High to Low
            </p>
            <p
              onClick={() => setFilter('AZ')}
              className={`cursor-pointer ${filter === 'AZ' ? 'text-blue-500' : ''}`}
            >
              A - Z
            </p>
            <p
              onClick={() => setFilter('ZA')}
              className={`cursor-pointer ${filter === 'ZA' ? 'text-blue-500' : ''}`}
            >
              Z - A
            </p>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="rounded-[20px] bg-white w-11/12 h-fit mt-3 shadow">
          <h1 className="font-Roboto tracking-wider font-medium border-b text-xl p-4">New Arrivals</h1>

          <div className="mb-5">
            {newArrivals.slice(0, 4).map((product) => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="flex shadow m-2 rounded-sm border overflow-hidden">
                  <img src={product.imageUrls[0]} className="w-4/12 object-contain p-1" />
                  <div className="w-8/12 p-2 bg-gray-200">
                    <div className="flex items-center justify-between">
                      <h1 className="font-Roboto font-medium text-xs">{product.name}</h1>
                    </div>

                    {/* Product Price */}
                    <div className="flex gap-x-4 text-sm font-Roboto mt-1">
                      <p className="text-black font-medium">₹ {product.price}</p>
                      <p className="line-through text-xs text-gray-500">₹ {product.price + 1000}</p>
                    </div>

                    {/* Product Rating */}
                    <div className="mt-1 flex flex-row items-end justify-between">
                      <div className="text-yellow-300 flex gap-x-1">
                        {[...Array(product.rating)].map((_, index) => (
                          <MdStar key={index} className="w-3" />
                        ))}
                      </div>
                      <p className="mt-1 font-Roboto text-sm text-gray-500">{product.ratingPercentage} %</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Posters */}
        <div className="relative rounded-[20px] bg-white w-11/12 h-[450px] mt-3 shadow">
          <img
            src="https://i.pinimg.com/236x/e7/ee/f2/e7eef2c53a60559f0803e226e9cec174.jpg"
            className="rounded-[20px] shadow w-full h-full object-cover"
          />
          <h1 className="text-white font-Roboto text-4xl tracking-wide absolute top-8 left-6 font-bold">
            Save 17% on Special
          </h1>
          <button className="absolute bottom-4 left-4 bg-black text-white font-Roboto tracking-wider text-lg px-7 py-1 rounded-full">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aside;
