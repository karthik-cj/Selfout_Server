const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
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
    type: Number,
    required: true,
  },
  favourite: {
    type: Boolean,
    required: true,
  },
  product: [
    {
      type: String,
      required: true
    }
  ],
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = { Shop, shopSchema };