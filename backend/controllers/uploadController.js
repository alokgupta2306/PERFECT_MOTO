const cloudinary = require('../utils/cloudinary');

// @desc    Upload product images directly to Cloudinary media buckets
// @route   POST /api/upload
// @access  Admin
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file detected in upload stream.' });
    }

    const fileBase64 = req.file.buffer.toString('base64');
    const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
      folder: 'perfect_moto/products',
      transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary storage bucket',
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    });
  } catch (error) {
    next(error);
  }
};