const express = require("express");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const fs = require("fs");


//Single image upload
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
      cb({
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
    console.log("file", req.file);
    const {
      path
    } = req.file; // file becomes available in req at this point
    if (!req.file) return res.send("Please upload a file");
    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path, {
        resource_type: "raw",
        public_id: `ImageUploads/${fName}`,
      },

      // Send cloudinary response or catch error
      (err, image) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);
        //res.send(image)
        res.json({
          msg: "Uploaded Successfully!",
          public_id: image.public_id,
          url: image.secure_url,
          // IMAGE_Obj:image
        });
      }
    );
  });
});

//TODO: Multiple image upload with cloudinary and multer

router.post("/multiple", (req, res) => {
    res.send("multiple");
    
})




// async function checkCreateUploadsFolder (uploadsFolder) {
// 	try {
// 		await fsa.statAsync(uploadsFolder)
// 	} catch (e) {
// 		if (e && e.code == 'ENOENT') {
// 			console.log('The uploads folder doesn\'t exist, creating a new one...')
// 			try {
// 				await fsa.mkdirAsync(uploadsFolder)
// 			} catch (err) {
// 				console.log('Error creating the uploads folder 1')
// 				return false
// 			}
// 		} else {
// 			console.log('Error creating the uploads folder 2')
// 			return false
// 		}
// 	}
// 	return true
// }

// Returns true or false depending on whether the file is an accepted type
// function checkAcceptedExtensions (file) {
// 	const type = file.type.split('/').pop()
// 	const accepted = ['jpeg', 'jpg', 'png', 'gif', 'pdf']
// 	if (accepted.indexOf(type) == -1) {
// 		return false
// 	}
// 	return true
// }


// router.post('/images', async (req, res) => {
// 	let form = Formidable.IncomingForm()
// 	const uploadsFolder = join(__dirname, 'dist', 'uploads')
// 	form.multiples = true
// 	form.uploadDir = uploadsFolder
// 	form.maxFileSize = 50 * 1024 * 1024 // 50 MB
// 	const folderCreationResult = await checkCreateUploadsFolder(uploadsFolder)
// 	if (!folderCreationResult) {
// 		return res.json({ok: false, msg: "The uploads folder couldn't be created"})
// 	}
// 	form.parse(req, async (err, fields, files) => {
// 		let myUploadedFiles = []
// 		if (err) {
// 			console.log('Error parsing the incoming form')
// 			return res.json({ok: false, msg: 'Error passing the incoming form'})
// 		}
// 		// If we are sending only one file:
// 		if (!files.files.length) {
// 			const file = files.files
// 			if (!checkAcceptedExtensions(file)) {
// 				console.log('The received file is not a valid type')
// 				return res.json({ok: false, msg: 'The sent file is not a valid type'})
// 			}
// 			const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
// 			myUploadedFiles.push(fileName)
// 			try {
// 				await fs.renameAsync(file.path, join(uploadsFolder, fileName))
// 			} catch (e) {
// 				console.log('Error uploading the file')
// 				try { await fs.unlinkAsync(file.path) } catch (e) {}
// 				return res.json({ok: false, msg: 'Error uploading the file'})
// 			}
// 		} else {
// 			for(let i = 0; i < files.files.length; i++) {
// 				const file = files.files[i]
// 				if (!checkAcceptedExtensions(file)) {
// 					console.log('The received file is not a valid type')
// 					return res.json({ok: false, msg: 'The sent file is not a valid type'})
// 				}
// 				const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
// 				myUploadedFiles.push(fileName)
// 				try {
// 					await fs.renameAsync(file.path, join(uploadsFolder, fileName))
// 				} catch (e) {
// 					console.log('Error uploading the file')
// 					try { await fs.unlinkAsync(file.path) } catch (e) {}
// 					return res.json({ok: false, msg: 'Error uploading the file'})
// 				}
// 			}
// 		}
// 		res.json({ok: true, msg: 'Files uploaded succesfully!', files: myUploadedFiles})
// 	})
// })

module.exports = router;