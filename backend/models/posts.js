const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: false },
    media: {
        type: [String], 
        validate: {
          validator: function (val) {
            console.log('Array Length:', val.length);
            return val.length <= 5; 
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
        type: mongoose.Schema.Types.ObjectId, 
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


function arrayLimit(val) {
    console.log(val);
    console.log(val.length)
    return val.length <= 5;
}

module.exports = {
    Post: mongoose.model('Post', PostSchema)
}