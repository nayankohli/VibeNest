const express=require("express");
const {protect} =require("../middlewares/authMiddleware.js");
const { getMessage, sendMessage }=require("../controllers/messageControllers.js");

const router = express.Router();

router.post('/send/:id',protect, sendMessage);
router.get('/all/:id',protect, getMessage);
 
module.exports = router;