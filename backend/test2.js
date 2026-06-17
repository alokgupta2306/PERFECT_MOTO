require('dotenv').config();
const mongoose = require('mongoose');
const { createProduct } = require('./controllers/productController');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
  
  const req = {
    body: {
      name: "Test Helmet",
      brand: "Vega",
      category: "6a24ba9cb1cc13c76dbdd8d9",
      description: "Test description",
      price: 3200,
      stock: 50,
      images: [{ url: "https://via.placeholder.com/500", isMain: true }]
    },
    user: { id: "admin" }
  };
  
  const res = {
    status: (code) => ({
      json: (data) => console.log('RESPONSE:', code, JSON.stringify(data, null, 2))
    })
  };
  
  createProduct(req, res, (err) => console.log('ERROR:', err));
});