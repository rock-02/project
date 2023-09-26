const isLoggedIn = require('../middlewares/isloggedIn');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const mongoose = require('mongoose');

const follow = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.send('No User with such id');
  }

  console.log(user);
  console.log(req.user);

  const status = user.followRequest.find((request) => {
    return request.toString() === req.user.user_id;
  });

  if (!status) {
    const userUpdated = await User.findOneAndUpdate(
      { _id: id },
      { $push: { followRequest: req.user.user_id } },
      { new: true, runValidators: true }
    );
    return res.json(userUpdated);
  } else {
    res.send('Already Requested');
  }
};

const unfollow = async (req, res) => {
  const { id: otherId } = req.params;
  const currentId = req.user.user_id;
  try {
    const Otheruser = await User.findOne({ _id: otherId });
    const currentUser = await User.findOne({ _id: currentId });
    if (!Otheruser || !currentUser) {
      return res.send('No User with such id');
    }

    if (!currentUser.following.includes(otherId)) {
      return res.send('Not follwing such userId');
    }

    const currentUserUpdated = await User.findOneAndUpdate(
      { _id: currentId },
      { $pull: { following: otherId } },
      { new: true, runValidators: true }
    );

    const otherUserUpdated = await User.findOneAndUpdate(
      { _id: otherId },
      { $pull: { followers: currentId } },
      { new: true, runValidators: true }
    );

    res.json(currentUserUpdated);
  } catch (error) {
    console.log(error);
  }
};

const getFollowers = async (req, res) => {
  try {
    const currentId = req.user.user_id;
    const currentUser = await User.findOne({ _id: currentId });
    if (!currentUser) {
      res.send('No user');
    }
    const followers = currentUser.followers;
    res.json({ followers, hits: followers.length });
  } catch (error) {
    console.log(error);
  }
};

const getFollowing = async (req, res) => {
  try {
    const currentId = req.user.user_id;
    const currentUser = await User.findOne({ _id: currentId });
    if (!currentUser) {
      res.send('No user');
    }
    const following = currentUser.following;
    res.json({ following, hits: following.length });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { id: otherId } = req.params;
    const currentUser = await User.findOne({ _id: otherId });
    if (!currentUser) {
      return res.send('No user');
    }

    if (!currentUser.following.includes(otherId)) {
      return res.send('Unauthorize access');
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
  }
};

const approveRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const currentId = req.user.user_id;
  try {
    const currentUser = await User.findOne({ _id: currentId });
    const requestedUser = await User.findOne({ _id: requestId });

    if (currentUser.followers.includes(requestId)) {
      return res.send('request already approved');
    }

    if (requestedUser.following.includes(currentId)) {
      return res.send('already following');
    }

    await User.findOneAndUpdate(
      { _id: requestId },
      {
        $push: { following: currentId },
      },
      { new: true, runValidators: true }
    );

    const currentUserUpdated = await User.findOneAndUpdate(
      { _id: currentId },
      {
        $push: { followers: requestId },
        $pull: {
          followRequest: requestId,
        },
      },
      { new: true, runValidators: true }
    );

    return res.json(currentUserUpdated);
  } catch (error) {
    console.log(error);
  }
};

const rejectRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const currentId = req.user.user_id;
  try {
    const currentUser = await User.findOne({ _id: currentId });
    const requestedUser = await User.findOne({ _id: requestId });

    if (currentUser.followers.includes(requestId)) {
      return res.send('request already approved');
    }

    if (requestedUser.following.includes(currentId)) {
      return res.send('already following');
    }

    const currentUserUpdated = await User.findOneAndUpdate(
      { _id: currentId },
      {
        $pull: {
          followRequest: requestId,
        },
      },
      { new: true, runValidators: true }
    );

    return res.json(currentUserUpdated);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  approveRequest,
  rejectRequest,
};
