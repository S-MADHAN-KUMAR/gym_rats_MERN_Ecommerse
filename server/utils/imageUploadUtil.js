import {v2 as cloudinary}  from 'cloudinary'

const imageUploadUtil = (fileBufferOrUrl) => {
    return new Promise((resolve, reject) => {
      if (/^https?:\/\/res\.cloudinary\.com\//.test(fileBufferOrUrl)) {
        resolve(fileBufferOrUrl);
      } else {

        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
  
        stream.end(fileBufferOrUrl);
      }
    });
  };

export {imageUploadUtil}