import CartModel from '../../models/cartModel.js'
import ProductModel from '../../models/productsModel.js'

const add_to_cart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // Validate the required fields
      if (!userId || !productId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
  
      const userCart = await CartModel.findOne({ userId });
      const product = await ProductModel.findById(productId);
  
      // Check if the product exists
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      // If the user doesn't have a cart, create a new cart and add the product
      if (!userCart) {
        const newCart = new CartModel({
          userId,
          products: [
            {
              productId,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.imageUrls?.[0],
            },
          ],
          totalAmt: product.price,
          totalQty: 1,
        });
  
        await newCart.save();
        return res.status(200).json({ success: true, message: "Item added to cart", cart: newCart });
      }
  
      // Check if the product already exists in the cart
      const existingProduct = userCart.products.find(
        (item) => item.productId.toString() === productId.toString()
      );
  
      // If product exists in cart, increase the quantity; else, add it to the cart
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        userCart.products.push({
          productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.imageUrls?.[0],
        });
      }
  
      // Update the total amount and quantity in the cart
      const totals = userCart.products.reduce(
        (acc, item) => {
          acc.totalAmt += item.price * item.quantity;
          acc.totalQty += item.quantity;
          return acc;
        },
        { totalAmt: 0, totalQty: 0 }
      );
  
      userCart.totalAmt = totals.totalAmt;
      userCart.totalQty = totals.totalQty;
  
      await userCart.save();
      return res.status(200).json({ success: true, message: "Cart updated", cart: userCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

const get_user_cart = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'User ID is required!' });
      }
  
      // Find the cart based on userId
      const userCart = await CartModel.findOne({ userId: id });
  
      if (!userCart) {
        return res.status(400).json({ message: 'Cart not found!' });
      }
  
      // Respond with the user's cart data
      res.status(200).json(userCart);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };


const update_cart_qty = async (req, res) => {
    try {
        const { cartId, productId, type } = req.body;

        const userCart = await CartModel.findById(cartId);
        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = userCart.products.find((item) => item.productId.toString() === productId.toString());
        if (!product) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const existProduct = await ProductModel.findById(productId);
        if (!existProduct) {
            return res.status(404).json({ message: 'Product does not exist' });
        }

        const maxLimit = 5; // Maximum quantity the user can have
        const stockAvailable = existProduct.stock - 1; // Stock from ProductModel

        if (type === 'increment') {
            // Check if the quantity exceeds the maximum limit of 5
            if (product.quantity >= maxLimit) {
                return res.status(200).json({ message: 'Maximum product quantity is 5',msg:true });
            }
            // Check if the stock allows the increment
            if (product.quantity + 1 > stockAvailable) {
                return res.status(200).json({ message: `Only ${stockAvailable} items are available in stock`,msg:true });
            }
            product.quantity += 1;
        } else if (type === 'decrement') {
            // Ensure there's at least 1 product in the cart
            if (product.quantity <= 1) {
                return res.status(200).json({ message: 'At least 1 product is required', msg:true});
            }
            product.quantity -= 1;
        } else {
            return res.status(400).json({ message: 'Invalid type parameter' });
        }

        // Update total quantity and amount
        userCart.totalQty = userCart.products.reduce((total, item) => total + item.quantity, 0);
        userCart.totalAmt = userCart.products.reduce((total, item) => total + item.quantity * item.price, 0);

        await userCart.save();

        res.status(200).json({ message: 'Quantity updated successfully', cart: userCart });
    } catch (error) {
        console.error('Error updating cart:', error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


export const remove_cart_product = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the cart for the given user
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the product to remove
    const newProducts = cart.products.filter((product) => product._id.toString() !== productId.toString());
    const foundProduct = cart.products.find((product) => product._id.toString() === productId.toString());

    if (!foundProduct) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the cart with the new products array
    cart.products = newProducts;
    cart.totalQty -= foundProduct.quantity;
    cart.totalAmt -= foundProduct.price * foundProduct.quantity;

    // Save the updated cart
    await cart.save();

    // Respond with the updated cart or success message
    res.status(200).json({ message: 'Product removed from cart', cart });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}



export {
    get_user_cart,
    add_to_cart,
    update_cart_qty
}