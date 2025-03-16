const express=require("express");
const {protect} =require("../middlewares/authMiddleware.js");
const { getMessage, sendMessage,searchUsers }=require("../controllers/messageControllers.js");

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/search', protect, searchUsers); // 🔹 Move this above
router.get('/:id', protect, getMessage);
module.exports = router;