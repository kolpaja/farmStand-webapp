const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy']

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ deleted: false, category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({ deleted: false });
    res.render("products/index", { products, category: "ALL" });
  }
});

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories })
})
app.get("/trash", async (req, res) => {
  const products = await Product.find({ deleted: true });
  res.render("products/trash", { products });
})
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories })
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`)
})

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(id, { deleted: true });
  res.redirect("/products");
});

app.patch("/trash/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndUpdate(id, { deleted: false }).then((msg) => res.redirect("/products"));
});

app.delete("/trash/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id).then(() => res.redirect("/products"));
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save().then(res.redirect(`/products/${newProduct._id}`));
});

app.listen(3030, () => console.log("App listening on port: 3030"));
