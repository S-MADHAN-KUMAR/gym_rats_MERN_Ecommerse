import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true , unique :true },
    imageUrl: { type: String, required: true }, 
    status: {type : Boolean , default:true },
  },{
    timestamps:true
});
  
  const CategoriesModel = mongoose.model('Categories', categoriesSchema);
  export default CategoriesModel;
  