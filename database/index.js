require("dotenv").config();
var knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "smartbrain"
  }
});
module.exports = knex;
