import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/mongoDB.js';
import cloudinaryConfig from './config/cloudinary.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//======================config=========================//

connectDB()
cloudinaryConfig()

//=======================Routes=========================//

// Admin Routes
app.use('/admin',adminRoutes)
 
// User Routes
app.use('/user',userRoutes)

//========================================================//


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
