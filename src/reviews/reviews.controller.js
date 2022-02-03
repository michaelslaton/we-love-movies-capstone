const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation -----------------------------------------------------
async function reviewExists(req, res, next) {
  const reviewId = req.params.reviewId;
  const data = await service.read(reviewId);

  if (data) {
    res.locals.foundReview = data;
    return next();
  }

  next({ status: 404, message: "Review cannot be found." });
}

// Update a review -----------------------------------------------
async function update(req, res) {
  const reviewId = req.params.reviewId;
  const updatedReview = {
    ...req.body.data,
    review_id: req.body.data.review_id,
  };
  await service.update(reviewId, updatedReview);
  const newData = await service.readReviews(reviewId);
  const data = await service.insertCritic(newData);
  return res.json({ data });
}

// Delete a review ------------------------------------------------
async function destroy(req, res) {
  const reviewId = req.params.reviewId;
  await service.destroy(reviewId);
  res.sendStatus(204);
}

module.exports = {
  delete: [reviewExists, asyncErrorBoundary(destroy)],
  update: [reviewExists, asyncErrorBoundary(update)],
};
