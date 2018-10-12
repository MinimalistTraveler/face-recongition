const express = require("express");
const router = express.Router();
// const db = require("../database/index");
const passport = require("passport");
const passportAuth = require("../routes/auth/passport");
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Grab the user from the payload
    return res.status(200).json(req.user);
  }
);

module.exports = router;
