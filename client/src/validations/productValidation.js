// validationSchema.js
import * as Yup from 'yup';

export const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters")
    .required("Name is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than zero"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),

  stock: Yup.number()
    .typeError("Stock must be a number")
    .required("Stock is required")
    .positive("Stock must be greater than zero"),

  category: Yup.string().required("Category is required"),

  brand: Yup.string().required("Brand is required"),

  images: Yup.array()
    .min(3, "You must upload at least 3 images")
    .max(5, "You can upload a maximum of 5 images")
    .required("Images are required")
    .test("fileType", "Only image files are allowed", (value) => {
      return value.every(file => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type));
    }),
});
