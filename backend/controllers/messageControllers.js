const {Conversation} =require("../models/conversation.js");
const { getReceiverSocketId, io } =require("../socket/socket.js");
const {Message}=require("../models/message.js");
// for chatting
const sendMessage = async (req,res) => {
    try {
        console.log("Sending message");
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const {message} = req.body;
      
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        // establish the conversation if not started yet.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),newMessage.save()])

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
console.log(newMessage);
        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
const getMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: 'messages',
            populate: [ 
                { path: 'receiverId', select: 'profileImage' }
            ]
        }).select('messages createdAt'); // Fetch messages & conversation creation date

        if (!conversation) return res.status(200).json({ success: true, messages: [], conversationDate: null });
console.log(conversation);
        return res.status(200).json({ 
            success: true, 
            messages: conversation.messages,
            conversationDate: conversation.createdAt  // Include conversation date
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};



module.exports = {
    getMessage,
    sendMessage
    // Exporting upload middleware for potential direct usage
  };