import CategoriesModel from "../../models/categoryModel.js";
import ProductModel from "../../models/productsModel.js";
import { imageUploadUtil } from "../../utils/imageUploadUtil.js";

// Get All Categories

export const get_all_categories = async (req, res) => {
    try {
      const categories = await CategoriesModel.find()
      res.status(200).json(categories)
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).send({
        message: 'Error fetching categories',
        error: error.message,
      });
    }
  };

// Add Categories

const add_categories = async (req, res) => {
    try {
      console.log('Uploaded file:', req.file); 
      const { name, status } = req.body;
      const image = req.file;
  
      if (!name || !status || !image) {
        return res.status(400).json({ message: 'Please provide all the fields including image.' });
      }
  
      const uploadImage = await imageUploadUtil(image.buffer); 
  
      const newCategory = new CategoriesModel({
        name,
        status,
        imageUrl: uploadImage,  
      });
  
      await newCategory.save(); 
  
      return res.status(201).json({
        message: 'Category added successfully!',
        category: newCategory
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while adding the category.', error: error.message });
    }
  }

// Get Edit Category

const get_edit_categories = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
  
      const Category = await CategoriesModel.findById(id);
  
      if (Category) {
        return res.status(200).json({ category: Category });
      } else {
        console.log(`Category with id ${id} not found.`);
        return res.status(404).json({ message: `Category with id ${id} not found.` });
      }
    } catch (error) {
      console.error('Error retrieving Category details:', error);
      return res.status(500).json({ message: 'Error retrieving Category details', error: error.message });
    }
  }

// Update Edit Category

const update_categories = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const image = req.file;
  
      let uploadImage;
      if (image) {
        uploadImage = await imageUploadUtil(image.buffer);
      } else {
        const existingCategory = await CategoriesModel.findById(id);
        if (!existingCategory) {
          return res.status(404).json({ message: 'Category not found.' });
        }
        uploadImage = existingCategory.imageUrl;
      }
  
      const newUpdateCategory = {
        name,
        status,
        imageUrl: uploadImage,
      };
  
      const updatedCategory = await CategoriesModel.findByIdAndUpdate(id, newUpdateCategory, { new: true });
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.status(200).json({
        message: 'Category updated successfully!',
        category: updatedCategory,
      });
    } catch (error) {
      console.error('Error while updating category:', error.message);
      return res.status(500).json({
        message: 'An error occurred while updating the category.',
        error: error.message
      });
    }
  };

//Block Category

const block_categories = async (req, res) => {
    try {
      const { id, status } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
  
      let productStatus = 'blocked';
      if (status === 'listed') {
        productStatus = 'listed'; 
      }
  
      const category = await CategoriesModel.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!category) {
        return res.status(404).json({ message: `Category with id ${id} not found.` });
      }
  
      const products = await ProductModel.find({ category: id });
  
      for (let product of products) {
        product.status = productStatus
        await product.save()
      }
  
      console.log(`Category with id ${id} has been ${status === 'listed' ? 'activated' : 'blocked'}.`);
  
      return res.status(200).json({
        message: `Category with id ${id} has been ${status === 'listed' ? 'activated' : 'blocked'}.`,
      });
  
    } catch (error) {
      console.error('Error updating category status:', error);
  
      return res.status(500).json({ message: 'Error updating category status', error: error.message });
    }
  };
  

export {
    add_categories,
    block_categories,
    get_edit_categories,
    update_categories
}