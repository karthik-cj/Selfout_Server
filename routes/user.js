const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Bill = require("../models/bill");
const { Product } = require("../models/product");
const User = require("../models/user");
const dateTime = require('node-datetime');


userRouter.post("/scanAdd", auth, async (req, res) => {
  try { 
    const { id } = req.body;
    const product = await Product.findOne({barcode: id});
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
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

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/billing/:total", auth, async (req, res) => {     //checkout cheyyumboo
  try {

    let user = await User.findById(req.user);
    let items = user.cart;
    user.cart = [];
    await user.save();
    const dt = dateTime.create();
    let datetime = dt.format('d-m-Y\nI:M p');

    let bill = new Bill({
      products: items,
      totalPrice: req.params.total,
      userId: req.user,
      Time: datetime
    });
    bill = await bill.save();
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.get("/recentpurchases", auth, async (req, res) => {
  try {
    const bill = await Bill.find({ userId: req.user });
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;




