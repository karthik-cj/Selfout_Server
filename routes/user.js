const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Bill = require("../models/bill");
const { Product } = require("../models/product");
const User = require("../models/user");

userRouter.post("/scanAdd", auth, async (req, res) => {
  try { 
    const { id } = req.body;
    const product = await Product.findOne({barcode: id});
    let user = await User.findById(req.user);

    if (user.recentPurchases.length == 0) {
      user.recentPurchases.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.recentPurchases.length; i++) {
        if (user.recentPurchases[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.recentPurchases.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.recentPurchases.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.delete("/scanRemove/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.recentPurchases.length; i++) {
      if (user.recentPurchases[i].product._id.equals(product._id)) {
        if (user.recentPurchases[i].quantity == 1) {
          user.recentPurchases.splice(i, 1);
        } else {
          user.recentPurchases[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/bill", auth, async (req, res) => {
  try {
    const { cart, totalPrice  } = req.body;
    let products = [];

    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i].product._id);
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();

    let bill = new Bill({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderedAt: new Date().getTime(),
    });
    bill = await bill.save();
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.get("/me", auth, async (req, res) => {
  try {
    const bill = await Bill.find({ userId: req.user });
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;

