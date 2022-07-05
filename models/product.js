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
    trim: true,
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
      type: String,
      required: true
    }
  ],

});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product, productSchema };
