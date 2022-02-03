const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Verification --------------------------------------------------------

async function movieExists(req, res, next) {
  const movieId = req.params.movieId;
  const data = await service.read(movieId);

  if (data) {
    res.locals.foundMovie = data;
    return next();
  }

  next({ status: 404, message: "Movie cannot be found." });
}

// List - Movies. If is_showing is True, list currently showing movies--
async function list(req, res) {
  const isShowing = req.query.is_showing;

  if (isShowing) {
    const data = await service.list((showing = true));
    return res.json({ data });
  }

  const data = await service.list();
  return res.json({ data });
}

// Read - A Movie by Id
async function read(req, res) {
  const data = res.locals.foundMovie;
  return res.json({ data });
}

// Read - List which theaters a specific MovieId is showing at-----------
async function readTheaters(req, res) {
  const movieId = req.params.movieId;
  const data = await service.readTheaters(movieId);
  return res.json({ data });
}

// Read - List reviews for a specific MovieId and the critic who wrote it-
async function readReviews(req, res) {
  const movieId = req.params.movieId;
  const data = await service.readReviews(movieId);
  return res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [movieExists, asyncErrorBoundary(read)],
  readTheaters: [movieExists, asyncErrorBoundary(readTheaters)],
  readReviews: [movieExists, asyncErrorBoundary(readReviews)],
};
