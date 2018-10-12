const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../../config/index");
const db = require("../../database/index");
const bcrypt = require("bcrypt");
// JSON Web Token
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the user that matches the given token payload if user doesn't exist return an error.
        const user = await db("users")
          .select("*")
          .where("email", payload.email)
          .returning("*");
        if (JSON.stringify(user[0]) === "[]" || user[0] === undefined) {
          return done(null, false);
        }
        // Return user if it does exist.
        return done(null, user[0]);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      /* Create the new user signin information. */
      try {
        /* If matchUser couldn't find any user or the password of the user 
      info don't match than it will return an error
     */
        // Find an email in the DB that matches the user.
        const matchUser = await db("login")
          .where("email", email)
          .returning("*");
        //  If no user is found return nothing.
        if (JSON.stringify(matchUser) === "[]") {
          return done(null, false);
        }
        //  Check to see if the password is valid
        const passwordMatch = await bcrypt.compare(password, matchUser[0].hash);
        // If the given password is invalid return nothing.
        if (!passwordMatch) {
          return done(null, false);
        }
        return done(null, matchUser[0]);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
