const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllUsers = catchAsync(async (req, res) => {
  const Users = await User.find();
  res.status(200).json({
    status: "success",
    results: Users.length,
    data: Users,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteAllUsers = async (req, res, next) => {
  await User.deleteMany();

  res.status(204).json({
    status: "success",
  });
};

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
