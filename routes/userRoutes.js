const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.post("/forgotPassword", authController.forgotPassword);
router.patch(
  "/resetPassword/:token",
  authController.protect,
  authController.resetPassword
);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.route("/delete").delete(userController.deleteAllUsers);

router.route("/").get(authController.protect, userController.getAllUsers);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("owner"),
    userController.deleteUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("owner"),
    userController.updateUser
  );

module.exports = router;
