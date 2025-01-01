import AddressModel from '../../models/addressModel.js'
import UserModel from '../../models/UserModel.js';

// Add address for user

const add_address = async (req, res) => {
  try {
    const { id, name, phone, addressline1, addressline2, city, state, pincode } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !phone || !addressline1 || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Prepare the address data
    const addressData = {
      name,
      phone,
      addressline1,
      addressline2,
      city,
      state,
      pincode,
    };

    // Check if the user exists
    const existUser = await UserModel.findById(id);

    if (!existUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the user already has an address
    const existAddress = await AddressModel.findOne({ userId: id });

    if (existAddress) {
      // If the user already has an address, add the new address to the addresses array
      existAddress.addresses.push(addressData);
      await existAddress.save();  // Save the updated address
      return res.status(200).json({ message: 'Address added successfully', address: existAddress });
    } else {
      // If the user does not have an address record, create a new one
      const newAddress = new AddressModel({
        userId: id,
        addresses: [addressData],  // Add the new address to the addresses array
      });

      await newAddress.save();  // Save the new address record
      return res.status(201).json({ message: 'Address added successfully', address: newAddress });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the address' });
  }
};

  
// Get current address for Edit Address
  
const get_current_address = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const address = await AddressModel.findOne({userId:id});

    if (!address) {
      return res.status(400).json({ message: "Address not found!" });
    }

    res.status(200).json({ message: "Successfully fetched!", address });
  } catch (error) {
    console.error('Error fetching address:', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const get_edit_address = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ message: "UserId and AddressId are required!" });
    }

    // Fetch user based on the provided userId
    const addressData = await AddressModel.findOne({userId});

    if (!addressData) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Get the user's addresses from the `addressData` document
    const allAddress = addressData.addresses; // Access the 'addresses' array inside the user document

    if (!allAddress || allAddress.length === 0) {
      return res.status(404).json({ message: "No addresses found!" });
    }

    // Find address based on the provided addressId
    const address = allAddress.find((add) => add._id.toString() === addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found for this user!" });
    }

    return res.status(200).json(address); // Return the found address

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const update_address = async (req, res) => {
  try {
    const { userId, addressId, newAddress } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ message: "UserId and AddressId are required!" });
    }

    // Fetch user based on the provided userId
    const addressData = await AddressModel.findOne({ userId });

    if (!addressData) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Get the user's addresses from the `addressData` document
    const allAddress = addressData.addresses; // Access the 'addresses' array inside the user document

    if (!allAddress || allAddress.length === 0) {
      return res.status(404).json({ message: "No addresses found!" });
    }

    // Find address based on the provided addressId
    const addressIndex = allAddress.findIndex((add) => add._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found for this user!" });
    }

    // Update only the fields that are present in `newAddress`
    Object.keys(newAddress).forEach((key) => {
      allAddress[addressIndex][key] = newAddress[key];
    });

    // Save the updated addressData document
    await addressData.save();

    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export{
    add_address,
    get_current_address
}