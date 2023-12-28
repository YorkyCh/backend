const List = require("./../models/listModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const Item = require("../models/itemModel");

exports.createList = catchAsync(async (req, res, next) => {
  const newDocument = await List.create(req.body);

  res.status(201).json({
    status: "success",
    data: { data: newDocument },
  });
});
exports.deleteAllLists = async (req, res, next) => {
  await List.deleteMany();

  res.status(204).json({
    status: "success",
  });
};

exports.getAllLists = factory.getAll(List);
exports.getList = factory.getOne(List, "items");
exports.updateList = factory.updateOne(List);
exports.deleteList = factory.deleteOne(List, Item);
