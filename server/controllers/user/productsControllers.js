import ProductModel from '../../models/productsModel.js';

export const get_related_products = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const categoryId = product.category;

    let relatedProducts = await ProductModel.find({
      category: categoryId,
      _id: { $ne: id },
    });

    // If no related products are found, fetch all products
    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = await ProductModel.find();
    }

    res.json({
      message: 'Related products fetched successfully!',
      relatedProducts,
    });
  } catch (error) {
    console.error('Error fetching related products:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product details
export const products_details = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.popularity += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
// get all products 
  
export const get_all_products = async (req,res)=>{
     
    try {
      const products = await ProductModel.find(); 
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      res.status(500).send({
        message: 'Error fetching products',
        error: error.message,
      });
    }
    }
  
// New Arrivals
  
export const new_arrivals = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 })

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send({
      message: 'Error fetching products',
      error: error.message,
    });
  }
};
