require("dotenv").config({});
const app = require("./app");
const db = require("./src/config/db");

const PORT = process.env.PORT || 3000;

db.connect();
app.listen(PORT, () => console.log(`Service started at port ${PORT}`));
