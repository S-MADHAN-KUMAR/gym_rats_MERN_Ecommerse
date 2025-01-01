import axios from "axios";
import { showToast } from "../helper/toast";

export const fetchCurrUser = async (userId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/get_current_user/${userId}`);
  
      if (res.status === 200) {
        const fetchedUser = res?.data?.currentUser;
        if (fetchedUser.status === false) {
          console.log('User blocked...');
          return null;
        }
        return fetchedUser;
      }
    } catch (error) {
      console.error('Error in fetchCurrUser:', error.message);
      return null; 
    }
  }

  export const updateProfile = async (updatedData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/user/update_profile`, updatedData)
      if (res.status === 200) {
        showToast('Profile updated successfully!', 'light', 'success');
        return res?.data?.updatedUser
      } else {
        showToast('Failed to update profile. Please try again.', 'dark', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      showToast('Unable to update profile. Please try again.', 'dark', 'error');
      return null;
    }
  }