const express = require("express");
const router = express.Router();
const db = require("../database/index");
const { getInputCoord } = require("./helpers/clarifai");

router.put("/", async (req, res) => {
  // Find a user with that id
  const { id, input } = req.body;
  try {
    // Check if the link is valid and grab the coordinates if so.
    const imageBoxCoord = await getInputCoord(input);
    if (imageBoxCoord.error) {
      return res.status(400).json({ error: "Invalid link." });
    }
    // Find a user with that id and add 1 entry.
    const foundedUser = await db("users")
      .select("*")
      .where("id", id)
      .increment("entries", 1)
      .returning("*");
    if (JSON.stringify(foundedUser) === "[]") {
      return res.status(404).send({ error: "User is not found." });
    }
    return res.json({
      entries: foundedUser[0].entries,
      regions: imageBoxCoord.regions
    });
  } catch (e) {
    res.status(400).send({ error: "Unable to update user." });
  }
});

module.exports = router;
