const { User } = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.js");
const multer = require("multer");
const path = require("path");
const bcrypt=require("bcryptjs")
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
  },
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Convert to plain object first, then add token
    const userToReturn = user.toObject();
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      dob:user.dob,
      gender:user.gender,
      location:user.location,
      privacy: user.privacy,
      jobProfile:user.jobProfile,
      bookmarks:user.bookmarks,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: "",
    username,
    email,
    password,
    profileImage: "",
    banner: "",
    bio: "",
    followers: [],
    following: [],
    posts: [],
    privacy: "public",
    bookmarks:[]
  });

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      privacy: user.privacy,
      bookmarks:user.bookmarks,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update text fields
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.jobProfile = req.body.jobProfile || user.jobProfile;
    user.location = req.body.location || user.location;

    // Update profileImage if uploaded
    if (req.files && req.files.profileImage) {
      user.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // Update banner if uploaded
    if (req.files && req.files.banner) {
      user.banner = `/uploads/${req.files.banner[0].filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      bio: updatedUser.bio,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      jobProfile: updatedUser.jobProfile,
      location: updatedUser.location,
      profileImage: updatedUser.profileImage,
      banner: updatedUser.banner,
      followers: updatedUser.followers,
      following: updatedUser.following,
      posts: updatedUser.posts,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Search users by username
const searchUsers = asyncHandler(async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }
    const users = await User.find({
      username: { $regex: query, $options: "i" }, 
    }).select("username profileImage name email"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const fetchProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const userProfile = await User.findById(userId); 
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.user._id; // patel
    const jiskoFollowKrunga = req.params.id; // shivani
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const isFollowing = user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const getFollowers = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("followers"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const people = [];
    for (const id of user.followers) {
      const follower = await User.findById(id).select(
        "name profileImage username jobProfile"
      );
      if (follower) {
        people.push(follower);
      }
    }
    if (people.length === 0) {
      return res
        .status(404)
        .json({ message: "No followers found for this user" });
    }

    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getFollowing = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("following");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const people = [];
    for (const id of user.following) {
      const follow = await User.findById(id).select(
        "name profileImage username jobProfile"
      );
      if (follow) {
        people.push(follow);
      }
    }
    if (people.length === 0) {
      return res
        .status(404)
        .json({ message: "No followers found for this user" });
    }
    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUserPrivacy = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.privacy = req.body.privacy;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      bio: updatedUser.bio,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      jobProfile: updatedUser.jobProfile,
      location: updatedUser.location,
      profileImage: updatedUser.profileImage,
      banner: updatedUser.banner,
      followers: updatedUser.followers,
      following: updatedUser.following,
      posts: updatedUser.posts,
      privacy: updatedUser.privacy,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getSavedPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      populate: [
        {
          path: 'postedBy',
          select: 'username profileImage bookmarks'
        },
        {
          path: 'comments',
          populate: {
            path: 'commentedBy',
            select: 'username profileImage'
          }
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      savedPosts: user.bookmarks
    });
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching saved posts',
      error: error.message
    });
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id)
try{
  if (user) {
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      res.status(400)
      throw new Error('Current password is incorrect')
    }
    if (newPassword.length < 8) {
      res.status(400)
      throw new Error('Password must be at least 8 characters long')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword
    await user.save()

    res.json({
      success:true,
      message: 'Password updated successfully'
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}catch(error){
  console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error while updating password',
      error: error.message
    });
}
  
})


module.exports = {
  registerUser,
  authUser,
  updateUserProfile,
  upload,
  getSuggestedUsers,
  searchUsers,
  fetchProfile,
  allUsers,
  followOrUnfollow,
  getFollowers,
  getFollowing,
  updateUserPrivacy,
  getSavedPosts,
  changeUserPassword
};
