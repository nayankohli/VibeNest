const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{ type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage:{ type: String, required: false },
    banner:{ type: String, required: false },
    bio:{ type: String, required: false },
    connections:{type:Number, required:false},
    posts:{type:Number, required:false}
});

module.exports = {
    User:mongoose.model('User', UserSchema)
}
