const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportAuth = require("./auth/passport");
const { JWT_SECRET } = require("../config/index");
const { sanitizeBody } = require("express-validator/filter");
router.post(
  "/",
  [
    passport.authenticate("local", {
      session: false
    }),
    sanitizeBody("*")
      .trim()
      .escape()
  ],
  async (req, res) => {
    try {
      // Generate web token for authentication
      const token = await jwt.sign(
        { ...req.user, hash: undefined },
        JWT_SECRET,
        {
          expiresIn: "5h",
          issuer: "Web Recongition"
        }
      );
      return res.json({ token: token });
    } catch (e) {
      console.log(e.message);
      return res.status(400).json({ error: "Invalid Email or Password" });
    }
  }
);

module.exports = router;
