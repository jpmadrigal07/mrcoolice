const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const user = new Schema({
    username: String,
    password: String,
    userType: {
        type: String,
        enum:[
            'Admin',
            'Staff'
        ]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('User', user);