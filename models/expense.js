const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const expense = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  cost: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Expense", expense);
