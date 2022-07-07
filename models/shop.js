const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  products: [
    {
      type: String
    }
  ],
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = { Shop, shopSchema };

