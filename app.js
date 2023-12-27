const express = require("express");

// import controllers
const globalErrorController = require("./controllers/errorController");

// routes imports
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");

// Import utils
const AppError = require("./utils/appError");

const app = express();

// midleware

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// routes
app.use("/api/shopping-lists", listRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorController);

module.exports = app;
