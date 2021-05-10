- Farm stand

1. basic connection with express mongoose and ejs with the path required

2. the index.js we establisht the conncetion with mongoose and MongoDB

3. we creat a model file where is the product.js model by mongoose and export that module.export = Product;

4. we require this model to our index.js // const Product = require("./models/product");

5. we get the page loaded with product by accessing to app.get("/products) and then making it a async function
   to await there const products = await Product.find({});
6. setting up the pages to display by taking data from the DB
