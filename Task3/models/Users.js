const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]{5,30}$/
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{11,12}$/    
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 250,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true,
        min: 9,
    },
    

},
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);