const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://karthik:hXdILnEkWtdcnuBS@cluster0.vie2q.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());
app.use(authRouter);
app.use(productRouter);
app.use(userRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
