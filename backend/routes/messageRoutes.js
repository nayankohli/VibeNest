const express=require("express");
const {protect} =require("../middlewares/authMiddleware.js");
const { getMessage, sendMessage,searchUsers,deleteBulkMessages,deleteMessage,updateMessage }=require("../controllers/messageControllers.js");

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/search', protect, searchUsers); 
router.delete('/bulk', protect, deleteBulkMessages);
router.get('/:id', protect, getMessage);
router.delete('/:id', protect, deleteMessage);
router.put('/:id', protect, updateMessage);
module.exports = router;