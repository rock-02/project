const cloudinary = require('cloudinary');
require('dotenv').config();

const connectcloud = () => {
  cloudinary.v2.config({
    cloud_name: 'dpwwhlx1a',
    api_key: '642264428777814',
    api_secret: '52-bYfSgSDeUQgO25O36dHr-DDo',
    secure: true,
  });
};

module.exports = { connectcloud };
