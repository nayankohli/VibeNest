const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const EditedProfile=new mongoose.Schema({
    name:String,
    username:String,
    profileImage:String,
    banner:String,
    bio:String
})
module.exports = {
    User:mongoose.model('User', UserSchema),
    EditedProfile:mongoose.model('EditedProfile', EditedProfile)
}
