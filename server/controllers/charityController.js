const Charity = require('../models/Charity');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find().sort({ createdAt: -1 });
    res.json({ success: true, charities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCharity = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Image upload error' });
      }

      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ success: false, message: 'Name and description are required' });
      }

      let imageUrl = '';

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'golf-charity/charities' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      }

      const charity = new Charity({
        name,
        description,
        image: imageUrl
      });

      await charity.save();

      res.status(201).json({
        success: true,
        message: 'Charity created successfully',
        charity
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCharities, createCharity };