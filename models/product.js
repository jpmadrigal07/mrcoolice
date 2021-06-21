const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const product = new Schema({
  weight: Number,
  scaleType: {
    type: String,
    enum: ["kg", "g"],
  },
  cost: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Product", product);
