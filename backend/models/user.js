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
    dob: { type: Date, required: false },
    location: { type: String, required: false }, 
    jobProfile: { type: String, required: false }, 
    joinedOn: { type: Date, default: Date.now }, 
    followers: { type: [String], required: false },
    following: { type: [String], required: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    privacy:{type: String, required:true, default:"public"},
    story:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
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
