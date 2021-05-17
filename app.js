const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/farmStand2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Connection open"))
  .catch((err) => console.log("oji mongo error", err));

const Product = require("./models/product"); //we import this from the models/products where we exported as a model
const Farm = require("./models/farms")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/test", (req, res) => res.send("testing routing"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy']

//todo Farm Routs
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms })
})

app.get("/farms/new", (req, res) => res.render("farms/newFarm"))

app.get("/farms/:id", async (req, res) => {
  const { id } = req.params
  const farm = await Farm.findById(id).populate("products")
  res.render("farms/showFarm", { farm })
})
app.delete("/farms/:id", async (req, res) => {
  const { id } = req.params
  const farm = await Farm.findByIdAndDelete(id)
  res.redirect("/farms")
})
app.post("/farms", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  res.redirect("/farms")
})

app.get("/farms/:id/products/newProduct", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/newProduct", { categories, farm })
})

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save()
  await product.save()
  res.redirect(`/farms/${id}`)
})



//todo Products Routs

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
  res.render("products/newProduct", { categories })
})
app.get("/trash", async (req, res) => {
  const products = await Product.find({ deleted: true });
  res.render("products/trash", { products });
})
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("farm", "name")
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

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id).then(() => res.redirect("/products"));
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save().then(res.redirect(`/products/${newProduct._id}`));
});

app.listen(3030, () => console.log("App listening on port: 3030"));
