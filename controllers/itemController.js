const Item = require("../models/itemModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllItems = catchAsync(async function (req, res, next) {
  const items = await Item.find({}, { __v: 0 });
  if (!req.body.list) req.body.list = req.params.id;

  res.status(200).json({
    status: "success",
    result: items.length,
    data: {
      items,
    },
  });
});

exports.setItemUserIds = (req, res, next) => {
  // nested routes
  if (!req.body.list) req.body.list = req.params.id;

  next();
};
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
