const express = require("express");
const router = express.Router();
const db = require("../database/index");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { sanitizeBody } = require("express-validator/filter");
//  Register a user route.
router.post(
  "/",
  [
    sanitizeBody("*")
      .trim()
      .escape()
  ],
  async (req, res) => {
    // Create New User
    const { username, email, password } = req.body;
    console.log(req.body);
    // Hash Password
    let hash = await bcrypt.hash(password, 14);
    const newUser = {
      username,
      email,
      password,
      entries: 0,
      joined: new Date()
    };
    // Validate new user
    const passReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const schema = {
      username: Joi.string()
        .max(150)
        .required(),
      email: Joi.string()
        .email()
        .max(150)
        .required(),
      password: Joi.string()
        .regex(passReg)
        .max(100)
        .required(),
      entries: Joi.number().required(),
      joined: Joi.date().required()
    };

    const isValid = Joi.validate(newUser, schema);
    if (!isValid) {
      return res.status(400).json({ error: isValid.error.details[0].message });
    }
    // Add to database
    try {
      db.transaction(async trx => {
        try {
          const createLoginReturnEmail = await trx
            .insert({
              hash,
              email
            })
            .into("login")
            .returning("email");
          const addUser = await trx("users")
            .insert({
              username: newUser.username,
              email: createLoginReturnEmail[0],
              entries: newUser.entries,
              joined: newUser.joined
            })
            .returning("*");
          return res.json(addUser[0]);
        } catch (e) {
          console.log(e);
          return res.status(400).json({ error: "Unable to register user." });
        }
      });
    } catch (e) {
      return res.status(400).json({ error: "Unable to register user." });
    }
  }
);

module.exports = router;
