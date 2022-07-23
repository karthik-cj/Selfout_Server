const mongoose = require("mongoose");
const { productSchema } = require("./product");

const billSchema = new mongoose.Schema({
  products: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  userId: {
    required: true,
    type: String,
  },
  shopName: {
    required: true,
    type: String,
  },
  shopImage: {
    required: true,
    type: String,
  },
  Time: {
    required: true,
    type: String,
  },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
