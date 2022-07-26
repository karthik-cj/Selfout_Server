const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Bill = require("../models/bill");
const Shop = require("../models/shop");
const { Product } = require("../models/product");
const User = require("../models/user");
const dateTime = require("node-datetime");

userRouter.post("/scanAdd/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ barcode: id });
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
      user = await user.save();
      return res.json(user.cart).status(200);
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }
      if (!isProductFound) {
        user.cart.push({ product, quantity: 1 });
        user = await user.save();
        return res.json(user.cart).status(200);
      }

      if (isProductFound) {
        return res.json().status(200);
      }
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.post("/addQuantity/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    let findProduct = user.cart.find((item) =>
      item.product._id.equals(product._id)
    );
    findProduct.quantity += 1;
    user = await user.save();
    res.json({ msg: "Quantity Updated" }).status(200);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.delete("/removeQuantity/:id", auth, async (req, res) => {
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
    res.status(200).json({ msg: "Item Removed" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.get("/emptyCart", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/checkout/:name/:total", auth, async (req, res) => {
  try {
    const { name, total } = req.params;
    let user = await User.findById(req.user);
    let shop = await Shop.findOne({ name });
    let shopImage = shop.images;
    if (user.cart.length == 0) {
      return res.status(400).json({ msg: "Cart Empty" });
    }
    let items = user.cart;
    user.cart = [];
    user = await user.save();
    const dt = dateTime.create();
    let datetime = dt.format("d-m-Y\nI:M p");

    let bill = new Bill({
      shopName: name,
      shopImage,
      products: items,
      totalPrice: total,
      userId: req.user,
      Time: datetime,
    });
    bill = await bill.save();
    res.status(200).json(bill);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.get("/recentpurchases", auth, async (req, res) => {
  try {
    const bill = await Bill.find({ userId: req.user });

    res.status(200).json(bill);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/addToFavourite/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    let shop = await Shop.findById(req.params.id);
    let { name, images, location } = shop;
    user.favourites.push({ name, images, location });
    user = await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.delete("/removeFromFavourite/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    let shop = await Shop.findById(req.params.id);
    for (let i = 0; i < user.favourites.length; i++) {
      if (user.favourites[i].name == shop.name) {
        user.favourites.splice(i, 1);
      }
    }
    user = await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.get("/favourites", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    fav = user.favourites;
    res.status(200).json(fav);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;
