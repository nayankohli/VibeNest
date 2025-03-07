const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { 
        type: String, 
        required: false, 
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" 
    },
    banner: { type: String, required: false },
    bio: { type: String, required: false },
    gender: { type: String, enum: ['male', 'female'] },
    dob: { type: Date, required: false }, // Added Date of Birth
    location: { type: String, required: false }, // Added Location
    jobProfile: { type: String, required: false }, // Added Job Profile
    joinedOn: { type: Date, default: Date.now }, // Added Joined On (defaults to account creation date)
    followers: { type: [String], required: false },
    following: { type: [String], required: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
},
{
    timestamps:true,
}
);

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = {
    User: mongoose.model('User', UserSchema)
}
