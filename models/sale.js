const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const sale = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  receiptNumber: Number,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  birNumber: Number,
  drNumber: Number,
  location: String,
  vehicleType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Sale", sale);
