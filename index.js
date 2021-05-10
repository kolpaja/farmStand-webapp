const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Product = require("./models/product"); //we import this from the models/products where we exported as a model

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Connection open"))
  .catch((err) => console.log("oji mongo error", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/test", (req, res) => res.send("testing routing"));

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

app.listen(3030, () => console.log("App listening on port: 3030"));
