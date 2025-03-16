const express=require("express");
const {protect} =require("../middlewares/authMiddleware.js");
const { accessChat,fetchChats,createGroupChat,updateGroup,removeFromGroup,addToGroup, upload }=require("../controllers/chatControllers.js");
const router = express.Router();
router.post('/',protect, accessChat);
router.get('/',protect, fetchChats);
router.post('/group',protect, createGroupChat);
router.put('/update',protect,upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]), updateGroup);
router.put('/groupremove',protect, removeFromGroup);
router.put('/groupadd',protect, addToGroup);

module.exports = router;