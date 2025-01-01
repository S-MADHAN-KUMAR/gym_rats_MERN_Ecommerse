import bcrypt from 'bcryptjs';
import UserModel from '../../models/UserModel.js';

// Update the user Profile 


export const update_profile = async (req, res) => {
  try {
    const { id, name, phone, password } = req.body;

    // Validate required fields
    if (!id || !name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find the current user by ID
    const currentUser = await UserModel.findById(id);
    if (!currentUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10); // You can change the saltRounds (10) if needed

    // Prepare updated user data
    const updatedUser = {
      name,
      phone,
      password: hashedPassword, // Store the hashed password
    };

    // Update the user record in the database
    const user = await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });

    if (user) {
      res.status(200).json({
        message: "Updated Successfully",
        updatedUser: user,
      });
    } else {
      res.status(400).json({ message: "Update failed!" });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: "Failed to update!" });
  }
};


