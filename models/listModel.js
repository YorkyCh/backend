const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "List name is required"],
      unique: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    members: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate --> items

listSchema.virtual("items", {
  ref: "Item",
  foreignField: "list",
  localField: "_id",
});

listSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "-__v -passwordChangedAt -email -role -_id",
  });

  next();
});

const List = mongoose.model("List", listSchema);

module.exports = List;
