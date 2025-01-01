import ProductModel from "../../models/productsModel.js";
import UserModel from "../../models/UserModel.js";
import WishlistModel from "../../models/wishlistModel.js";

// Add to Wishlist
export const add_to_wishlist = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        // Check if the product and user exist
        const existProduct = await ProductModel.findById(productId);
        const user = await UserModel.findById(userId);

        if (!existProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = {
            productId,
            name: existProduct.name,
            price: existProduct.price,
            description: existProduct.description,
            image: existProduct.imageUrls?.[0],
        };

        // Find the user's wishlist
        let wishlist = await WishlistModel.findOne({ userId });

        if (!wishlist) {
            // Create a new wishlist if it doesn't exist
            wishlist = new WishlistModel({
                userId,
                products: product
            });

            user.wishlist.push({ productId });
            await user.save();
            await wishlist.save();
        } else {
            // Check if the product already exists in the wishlist
            const productExists = wishlist.products.some(
                (item) => item.productId.toString() === productId
            );

            if (productExists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            // Add the product to the existing wishlist
            wishlist.products.push(product);
            user.wishlist.push({ productId });

            await user.save();
            await wishlist.save();
        }

        res.status(200).json({ message: 'Product added to wishlist successfully!' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get User Wishlist
export const get_user_wishlist = async (req, res) => {
    try {
        const { id } = req.params; // Corrected from req.param to req.params

        // Fetch the user's wishlist
        const wishlist = await WishlistModel.findOne({ userId: id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json({ wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const remove_wishlist_product = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      const wishlist = await WishlistModel.findOne({ userId });
      const user = await UserModel.findById(userId);
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      // Filter out the product with the given productId
      wishlist.products = wishlist.products.filter((product) => product.productId.toString() !== productId.toString());
      user.wishlist =  user.wishlist.filter((product) => product.productId.toString() !== productId.toString());
  
      await wishlist.save();
      await user.save();
  
      res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  