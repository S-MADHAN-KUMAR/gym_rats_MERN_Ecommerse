import axios from 'axios';

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/get_all_brands`);
    const brands = response?.data
    return brands
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
};
