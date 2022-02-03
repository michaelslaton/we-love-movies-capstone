const res = require("express/lib/response");
const knex = require("../db/connection");

// Retrieve a review by it's Id ----------------------------
function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

// Review by id - Start ------------------------------------
function readCritic(critic_id) {
  return knex("critics")
    .where({ critic_id })
    .first();
}

async function insertCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

function readReviews(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.review_id": reviewId })
    .first();
}
// end review by id

function update(reviewId, updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .update(updatedReview, "*");
}

// Delete function
function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  destroy,
  update,
  readReviews,
  insertCritic,
  read,
};
