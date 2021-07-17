const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const cash = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  onePeso: Number,
  fivePeso: Number,
  tenPeso: Number,
  twentyPeso: Number,
  fiftyPeso: Number,
  oneHundredPeso: Number,
  twoHundredPeso: Number,
  fiveHundredPeso: Number,
  oneThousandPeso: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Cash", cash);
