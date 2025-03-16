const mongoose=require("mongoose");

const conversationSchema = new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profileImage: { 
        type: String, 
        required: false, 
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" 
    },
}, { timestamps: true })
module.exports={Conversation : mongoose.model('Conversation', conversationSchema)} ;