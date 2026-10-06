require("dotenv").config();
const Product = require("./models/Product");
console.log(Object.keys(Product.schema.paths).join("\n"));
process.exit(0);