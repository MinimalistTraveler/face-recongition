const express = require("express");
require("express-async-errors");

const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const helmet = require("helmet");
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routerMain = require("./routes/index");

app.use("/", routerMain);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
