const express = require("express");
const listController = require("./../controllers/listController");
const authController = require("./../controllers/authController");
const itemRouter = require("./itemRoutes");

const router = express.Router();

router.use("/:id/items", itemRouter);

router
  .route("/")
  .get(authController.protect, listController.getAllLists)
  .post(
    authController.protect,
    authController.checkInputedOwner,
    listController.createList
  );

router.route("/delete").delete(listController.deleteAllLists);

router
  .route("/:id")
  .get(authController.protect, listController.getList)
  .patch(authController.protect, listController.updateList)
  .delete(
    authController.protect,
    authController.restrictTo("owner"),
    listController.deleteList
  );

module.exports = router;
