const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const customer = new Schema({
    name: String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('Customer', customer);