const express = require("express");
const router = express.Router();
const db = require("../database/index");
// Route Directories
const registerRoute = require("./register");
const signInRoute = require("./signin");
const profileRoute = require("./profile");
const imageRoute = require("./image");
// Routes
router.use("/register", registerRoute);
router.use("/signin", signInRoute);
router.use("/profile", profileRoute);
router.use("/image", imageRoute);
// Main Route
router.get("/", async (req, res) => {
  // Shows all the users in the DB
  const getUsers = await db("users").returning("*");
  return res.send(getUsers);
});

module.exports = router;
