const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");
const { Shop } = require("../models/shop");

productRouter.get("/products/:shop", auth, async (req, res) => {  
  try {
    const products = await Product.find({ 
      shop: { $regex: req.params.shop, $options: "i" },
     });

    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/search/:shop/:name", auth, async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
      shop: { $regex: req.params.shop, $options: "i" },
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/shop/search/:name", auth, async (req, res) => {
  try {
    const shop = await Shop.find({
      name: { $regex: req.params.name, $options: "i" },
    });

    res.json(shop);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
