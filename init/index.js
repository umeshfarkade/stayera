const mongoose = require("mongoose");
const initData = require("./generateData.js");
const Listing = require("../models/listing.js");
const { geocodeLocation } = require("../utils/geocode");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log("Mongo URL =", Mongo_URL);

async function initDB() {
  try {
    console.log("========== INIT DB STARTED ==========");

    await Listing.deleteMany({});
    console.log("Old listings deleted");

    console.log("Seed data length:", initData.data.length);

    const listings = [];

    for (let listing of initData.data) {
      console.log("Processing:", listing.title);

      try {
        const coords = await geocodeLocation(listing.location, listing.country);

        listing.latitude = coords.latitude;
        listing.longitude = coords.longitude;

        console.log(
          `Coordinates found: ${coords.latitude}, ${coords.longitude}`,
        );
      } catch (err) {
        console.log("Geocode failed for:", listing.title, err.message);

        listing.latitude = 20.5937;
        listing.longitude = 78.9629;
      }

      listings.push({
        ...listing,
        owner: "000000000000000000000000",
      });

      // Temporary: remove delay for debugging
      // await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    console.log("Listings ready for insert:", listings.length);

    const result = await Listing.insertMany(listings);

    console.log("Inserted documents:", result.length);

    const count = await Listing.countDocuments();

    console.log("Total documents in DB:", count);

    console.log("========== DATA INITIALIZED ==========");
  } catch (err) {
    console.error("INIT DB ERROR:");
    console.error(err);
  }
}

async function main() {
  try {
    await mongoose.connect(Mongo_URL);

    console.log("Connected to DB");

    await initDB();

    await mongoose.connection.close();

    console.log("Connection Closed");
  } catch (err) {
    console.error("MAIN ERROR:");
    console.error(err);
  }
}

main();
