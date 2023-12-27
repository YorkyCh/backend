const express = require("express");
const itemController = require("./../controllers/itemController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, itemController.getAllItems)
  .post(
    authController.protect,
    authController.restrictTo("owner", "member"),
    itemController.setItemUserIds,
    itemController.createItem
  );

router
  .route("/:id")
  .delete(authController.protect, itemController.deleteItem)
  .patch(authController.protect, itemController.updateItem)
  .get(authController.protect, itemController.getItem);

module.exports = router;
