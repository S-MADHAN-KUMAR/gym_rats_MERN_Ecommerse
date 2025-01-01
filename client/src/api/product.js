import axios from 'axios';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/get_all_products`);
    const products = response?.data;

    if (products) {
      // Filter products to only include those with status true (listed products)
      const activeProducts = products.filter(product => product.status === true);
      console.log(activeProducts);
      return activeProducts;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


export const fetchNewArrivals = async (setNewArrivals) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/new_arrivals`);
    if (response.status === 200) {
      const newArrivals = response?.data;
      setNewArrivals(newArrivals);
    }
  } catch (error) {
    console.error('Error fetching new arrivals:', error.message);
  }
}

export const fetchProductDetail = async (setProduct, setMainImage, setImages, id) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/products_details/${id}`);
    if (res.status === 200) {
      const product = res?.data
      setProduct(product);
      setMainImage(product?.imageUrls?.[0]);
      setImages(product?.imageUrls);
    }
  } catch (error) {
    console.log(error.message);
    throw new Error('Error fetching product details');
  }
}

export const fetchRelatedProducts = async (setRelatedProducts, setError, id) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/get_related_products/${id}`);
    if (res.status === 200) {
      const filteredProducts = res?.data?.relatedProducts.filter((product) => product.status === true);
      setRelatedProducts(filteredProducts);
    }
  } catch (error) {
    console.log(error.message);
    setError('Error fetching related products');
  }
}
