const Clarifai = require("clarifai");
require("dotenv").config();
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
});

// Clarify
module.exports = {
  getInputCoord: async input => {
    try {
      const response = await app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        input
      );
      // Add the entries
      return {
        regions: response.outputs[0].data.regions[0].region_info.bounding_box
      };
    } catch (e) {
      return { error: "Cannot return coordinates." };
    }
  }
};
