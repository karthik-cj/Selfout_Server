const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");
const Shop = require("../models/shop");
const User = require("../models/user");

productRouter.get("/products/:shop", auth, async (req, res) => {
  try {
    // let fav = false;
    // let shop = await Shop.findById(req.params.shop);
    // let user = await User.findById(req.user);

    // for (let i = 0; i < user.favourites.length; i++) {
    //   if (user.favourites[i].name == shop.name) fav = true;
    // }

    const products = await Product.find({
      shop: { $elemMatch: { $eq: req.params.shop } },
    });
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/product/:shop", auth, async (req, res) => {
  try {
    let fav = false;
    let shop = await Shop.findById(req.params.shop);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.favourites.length; i++) {
      if (user.favourites[i].name == shop.name) fav = true;
    }
    res.status(200).json({ fav: fav });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/search/:shop/:name", auth, async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
      shop: { $elemMatch: { $eq: req.params.shop } },
    });

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/shop/search/:name", auth, async (req, res) => {
  try {
    const shop = await Shop.find({
      name: { $regex: req.params.name, $options: "i" },
    });

    res.status(200).json(shop);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/shops", auth, async (req, res) => {
  try {
    const shop = await Shop.find({});
    res.status(200).json(shop);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
