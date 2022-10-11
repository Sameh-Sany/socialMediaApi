const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
// db connection
const db = require("./src/config/db");
db.connect();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

dotenv.config();
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
