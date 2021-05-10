const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Connection open"))
  .catch((err) => console.log("oji mongo error", err));

// const p = new Product({
//   name: "Ruby grapefruit",
//   price: 1.99,
//   category: "fruit",
// });

// p.save()
//   .then((p) => console.log(p))
//   .catch((e) => console.log(e));

const seedProducts = [
  {
    name: "Ruby grapefruit",
    price: 1.99,
    category: "fruit",
  },
  {
    name: "Fairy eggplant",
    price: 1.0,
    category: "vegetable",
  },
  {
    name: "grapefruit",
    price: 1.99,
    category: "fruit",
  },
  {
    name: "milk",
    price: 0.99,
    category: "dairy",
  },
];

Product.insertMany(seedProducts)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
