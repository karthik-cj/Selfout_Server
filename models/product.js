const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  shop: [
    {
      type: String
    }
  ],

});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product, productSchema };
