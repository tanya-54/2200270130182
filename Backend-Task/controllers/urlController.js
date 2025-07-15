const Url = require("../models/Url");
const generateShortCode = require("../utils/generateShortCode");
const geoip = require("geoip-lite");
const { logger } = require("../middlewares/logger");

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    let short = shortcode || generateShortCode();
    const expiryDate = new Date(Date.now() + validity * 60000);

    const exists = await Url.findOne({ shortcode: short });
    if (exists && shortcode) {
      return res.status(400).json({ error: "Shortcode already in use" });
    }

    const newUrl = new Url({ url, shortcode: short, expiry: expiryDate });
    await newUrl.save();

    return res.status(201).json({
      shortLink: `http://localhost:3000/${short}`,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    logger.error("Create URL Error", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.redirect = async (req, res) => {
  const { shortcode } = req.params;
  try {
    const found = await Url.findOne({ shortcode });
    if (!found) return res.status(404).json({ error: "Shortcode not found" });
    if (new Date() > found.expiry) return res.status(410).json({ error: "Link expired" });

    const location = geoip.lookup(req.ip)?.country || "Unknown";
    found.clicks.push({
      timestamp: new Date(),
      referrer: req.get("Referrer") || "Direct",
      location
    });
    await found.save();

    res.redirect(found.url);
  } catch (err) {
    logger.error("Redirect Error", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  const { shortcode } = req.params;
  try {
    const found = await Url.findOne({ shortcode });
    if (!found) return res.status(404).json({ error: "Shortcode not found" });

    res.json({
      url: found.url,
      createdAt: found.createdAt,
      expiry: found.expiry,
      totalClicks: found.clicks.length,
      clicks: found.clicks
    });
  } catch (err) {
    logger.error("Stats Error", err);
    return res.status(500).json({ error: "Server error" });
  }
};
