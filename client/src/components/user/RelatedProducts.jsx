// src/components/RelatedProducts.js
import React from 'react';
import Card from './Card';

const RelatedProducts = ({ products }) => {
  return (
    <div className="w-[100vw] h-[100vh]">
      <h2 className='font-audiowide uppercase text-[22px] md:text-3xl md:mb-12 mb-6 '>Related Products</h2>
      <div className="flex flex-wrap gap-x-10 p-5">
        {products.length > 0 ? (
          products.map((product) => (
            <Card product={product}/>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
