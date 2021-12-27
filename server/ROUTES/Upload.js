const express = require("express");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const fs = require('fs')
router.post("/", (req, res) => {
  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  // Filter the file to validate if it meets the required audio extension
  const fileFilter = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|mp4/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        {
          message: "Unsupported File Format",
        },
        false
      );
    }
  };

  // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 10 * 1024 * 1024 * 1024,
    },
    fileFilter,
  }).single("image");

  // upload to cloudinary
  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
    const { path } = req.file; // file becomes available in req at this point
    if (!req.file) return res.send('Please upload a file')
    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "raw",
        public_id: `ImageUploads/${fName}`,
      },

      // Send cloudinary response or catch error
      (err, image) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);
        //res.send(image)
        res.json({
          msg:"Uploaded Successfully!",
          public_id: image.public_id,
          url: image.secure_url,
        });
      }
    );
  });
});

module.exports = router;
