const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const features = require("../utils/features");

exports.deleteOne = (Model, Item) =>
  catchAsync(async (req, res, next) => {
    // Delete all items associated with the list ID
    if (Item) await Item.deleteMany({ list: req.params.id });

    // Delete the list itself
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(new AppError("No document with such id was found", 404));
    }

    res.status(204).json({
      status: "success",
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: { data: newDocument },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = new features(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();

    const doc = await feature.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
