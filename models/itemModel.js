const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Item name is required"] },
    resolved: {
      type: Boolean,
      default: false,
    },
    list: {
      type: mongoose.Schema.ObjectId,
      ref: "List",
      required: [true, "Item must belong to a list."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "list",
    select: "-owner -__v -members -name",
  });
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
