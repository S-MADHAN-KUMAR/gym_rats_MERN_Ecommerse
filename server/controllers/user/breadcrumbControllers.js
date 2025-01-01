import ProductModel from '../../models/productsModel.js'

// Bread crumb for show Product name on top

const breadCrumb =async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ name: product.name })
    } catch (error) {
      console.error('Server error:', error)
      res.status(500).json({ error: 'Server error' });
    }
  }

export {
    breadCrumb
}