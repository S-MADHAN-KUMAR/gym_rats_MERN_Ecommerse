import CategoriesModel from "../../models/categoryModel.js";
import CategoryOfferModel from '../../models/categoriesOfferModel.js'
import ProductOfferModel from "../../models/productOfferModel.js";
import ProductModel from "../../models/productsModel.js";

export const add_product_offer = async (req, res) => {
  try {
    const { productId, discount, startDate, endDate, status } = req.body; 

    const existOffer = await ProductOfferModel.findOne({ productId });

    if (!existOffer) {
      const newOffer = new ProductOfferModel({
        productId, 
        discount,
        startDate,
        endDate,
        status,
      });

      await newOffer.save(); 
      res.status(200).json({ message: "Offer added successfully!", newOffer }); 
    } else {
      res.status(400).json({ message: "Offer already exists!",msg:true});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const get_all_product_offer = async (req, res) => {
    try {
      // Fetch all product offers from the database
      const offers = await ProductOfferModel.find();
  
      if (offers.length === 0) {
        return res.status(404).json({ message: "No product offers found." });
      }
  
      // Fetch all products from the database
      const products = await ProductModel.find();
  
      // Map through each offer and match it with the product
      const offersWithProductDetails = offers.map((offer) => {
        const product = products.find((prod) => prod._id.toString() === offer.productId.toString());
  
        if (product) {
          // Merge product details into the offer
          return {
            ...offer.toObject(),
            productName: product.name,
            productImage: product.imageUrls?.[0],
          };
        }
  
        return offer; // If no matching product found, return the offer as is
      });
  
      res.status(200).json(offersWithProductDetails); // Send the merged offers with product details
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
export const block_product_offer = async (req, res) => {
    const { id, status } = req.body;
  
    try {
      // Find the product offer by ID
      const productOffer = await ProductOfferModel.findById(id);
  
      if (!productOffer) {
        return res.status(404).json({ message: 'Product offer not found' });
      }
  
      // Update the product offer status
      productOffer.status = status;
  
      // Save the updated product offer
      await productOffer.save();
  
      return res.status(200).json({ message: `Product offer has been ${status ? 'listed' : 'unlisted'}` });
    } catch (error) {
      console.error('Error blocking/unblocking product offer:', error);
      return res.status(500).json({ message: 'Failed to update product offer status' });
    }
  }




  export const add_categories_offer = async (req, res) => {
    try {
      const { categoryId, discount, startDate, endDate, status } = req.body; 
  
      const existOffer = await CategoryOfferModel.findOne({ categoryId });
  
      if (!existOffer) {
        const newOffer = new CategoryOfferModel({
          categoryId, 
          discount,
          startDate,
          endDate,
          status,
        });
  
        await newOffer.save(); 
        res.status(200).json({ message: "Offer added successfully!", newOffer }); 
      } else {
        res.status(400).json({ message: "Offer already exists!",msg:true});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const get_all_categories_offer = async (req, res) => {
      try {
        // Fetch all product offers from the database
        const offers = await CategoryOfferModel.find();
    
        if (offers.length === 0) {
          return res.status(404).json({ message: "No product offers found." });
        }
    
        // Fetch all products from the database
        const categories = await CategoriesModel.find();
    
        // Map through each offer and match it with the product
        const offersWithProductDetails = offers.map((offer) => {
          const category = categories.find((prod) => prod._id.toString() === offer.categoryId.toString());
    
          if (category) {
            // Merge product details into the offer
            return {
              ...offer.toObject(),
              categoriesName: category.name,
              categoriesImage: category.imageUrl,
            };
          }
    
          return offer; // If no matching product found, return the offer as is
        });
    
        res.status(200).json(offersWithProductDetails); // Send the merged offers with product details
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
    
  export const block_categories_offer = async (req, res) => {
      const { id, status } = req.body;
    
      try {
        // Find the product offer by ID
        const categoryOffer = await CategoryOfferModel.findById(id);
    
        if (!categoryOffer) {
          return res.status(404).json({ message: 'Product offer not found' });
        }
    
        // Update the product offer status
        categoryOffer.status = status;
    
        // Save the updated product offer
        await categoryOffer.save();
    
        return res.status(200).json({ message: `Product offer has been ${status ? 'Activated' : 'Blocked'}` });
      } catch (error) {
        console.error('Error blocking/unblocking product offer:', error);
        return res.status(500).json({ message: 'Failed to update product offer status' });
      }
    }