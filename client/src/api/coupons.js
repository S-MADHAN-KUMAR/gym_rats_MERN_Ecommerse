import axios from 'axios';

export const fetchCoupons = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/get_all_coupons`);
    const coupons = response?.data
    return coupons
  } catch (error) {
    console.error("Error fetching coupons:", error);
  }
};