const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date },
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      location: String
    }
  ]
});

module.exports = mongoose.model("Url", urlSchema);
