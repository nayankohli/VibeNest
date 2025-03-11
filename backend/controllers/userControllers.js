const { User } = require('../models/user.js');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  },
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      jobProfile:user.jobProfile,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name: '',
    username,
    email,
    password,
    profileImage: '',
    banner: '',
    bio: '',
    followers: [],
    following:[],
    posts: [],
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      jobProfile:user.jobProfile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
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
    throw new Error('User not found');
  }
});


// Search users by username
const searchUsers = asyncHandler(async (req, res) => {
  try {
    // Get the search query from the request
    const query = req.query.query;

    // Validate the query
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search for users whose username matches the query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // "i" makes the search case-insensitive
    }).select("username profileImage name"); // Return only the required fields

    // Respond with the search results
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const fetchProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const userProfile = await User.findById(userId); // Fetch user data from DB
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
              message: 'You cannot follow/unfollow yourself',
              success: false
          });
      }

      const user = await User.findById(followKrneWala);
      const targetUser = await User.findById(jiskoFollowKrunga);

      if (!user || !targetUser) {
          return res.status(400).json({
              message: 'User not found',
              success: false
          });
      }
      // mai check krunga ki follow krna hai ya unfollow
      const isFollowing = user.following.includes(jiskoFollowKrunga);
      if (isFollowing) {
          // unfollow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'Unfollowed successfully', success: true });
      } else {
          // follow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'followed successfully', success: true });
      }
  } catch (error) {
      console.log(error);
  }
}

const getFollowers = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from the request parameters


    // Fetch the user by ID and get the array of followers' IDs
    const user = await User.findById(userId).populate('followers'); // This just gives us the IDs of followers

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an empty array to store the follower details
    const people = [];

    // Use for...of loop to handle async/await properly
    for (const id of user.followers) {
      // Fetch each follower's details by ID and populate the required fields
      const follower = await User.findById(id).select('name profileImage username jobProfile');

      // Check if the follower exists and push to the people array
      if (follower) {
        people.push(follower);
      }
    }

    // Check if followers exist
    if (people.length === 0) {
      return res.status(404).json({ message: 'No followers found for this user' });
    }

    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const getFollowing = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('following');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const people = [];
    for (const id of user.following) {
      const follow = await User.findById(id).select('name profileImage username jobProfile');
      if (follow) {
        people.push(follow);
      }
    }
    if (people.length === 0) {
      return res.status(404).json({ message: 'No followers found for this user' });
    }
    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const getSuggestedUsers = async (req, res) => {
  try {
      const suggestedUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json({
          success: true,
          users: suggestedUsers
      })
  } catch (error) {
      console.log(error);
  }
};

module.exports = { registerUser, authUser, updateUserProfile, upload,getSuggestedUsers ,searchUsers,fetchProfile,allUsers,followOrUnfollow,getFollowers,getFollowing};
