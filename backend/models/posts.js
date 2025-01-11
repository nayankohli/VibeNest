const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: false },
    media: [{
        type: String,
        required: false,
        validate: [arrayLimit, "Exceeds the limit of 5 media files per post"]
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        text: { type: String, required: true },
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: { type: Date, default: Date.now }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
},
{
    timestamps: true,
});

// Validator for media array limit
function arrayLimit(val) {
    return val.length <= 5;
}

module.exports = {
    Post: mongoose.model('Post', PostSchema)
}