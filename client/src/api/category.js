import axios from 'axios';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/get_all_categories`);
    const categories = response?.data
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
