if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const notFoundHandler = require("./errors/notFoundHandler");
const errorHandler = require("./errors/errorHandler");

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");
 
const cors = require("cors");

app.use(express.json());
app.use("/reviews", reviewsRouter);
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);

//Not found handler
app.use(notFoundHandler);
//error handler
app.use(errorHandler);

module.exports = app;
