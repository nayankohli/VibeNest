const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: false },
    media: {
        type: [String], // An array of strings
        validate: {
          validator: function (val) {
            console.log('Array Length:', val.length);
            return val.length <= 5; // Validate the length of the array
          },
          message: 'Exceeds the limit of 5 media files per post',
        },
      },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId, // Store reference IDs instead of full objects
        ref: "Comment"
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
    console.log(val);
    console.log(val.length)
    return val.length <= 5;
}

module.exports = {
    Post: mongoose.model('Post', PostSchema)
}