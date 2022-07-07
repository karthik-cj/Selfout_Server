const mongoose = require("mongoose");
const { productSchema } = require("./product");
const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
  },
  number: {
    required: true,
    type: String,
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
