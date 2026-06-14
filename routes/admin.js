const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn } = require("../utils/middleware");
const wrapAsync = require("../utils/wrapAsync.js");

router.get(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const user = res.locals.currentUser;

    const listings = await Listing.find({
      owner: user._id,
    });

    res.render("admin/dashboard.ejs", {
      user,
      listings,
      totalListings: listings.length,
    });
  }),
);

router.get(
  "/listing",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const user = res.locals.currentUser;

    const listings = await Listing.find({
      owner: user._id,
    });

    res.render("admin/listing", {
      user,
      listings,
    });
  }),
);

router.get("/coming", isLoggedIn, (req, res) => {
  res.render("coming.ejs");
});

module.exports = router;
