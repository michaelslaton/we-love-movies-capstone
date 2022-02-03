const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// List movies, if "showing" list only movies showing in theaters ----------
function list(showing) {
  if (showing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
      .select(
        "m.movie_id",
        "m.title",
        "m.runtime_in_minutes",
        "m.rating",
        "m.description",
        "m.image_url"
      )
      .where({ is_showing: true })
      .groupBy("m.movie_id")
      .orderBy("m.movie_id");
  }

  return knex("movies").select(
    "movie_id",
    "title",
    "runtime_in_minutes",
    "rating",
    "description",
    "image_url"
  );
}

// Retrieve a movie by it's id
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

// Retrieve all theaters where a movieId is showing ---------------------
function readTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ "mt.movie_id": movieId })
    .orderBy("t.theater_id");
}

// Review called by movie ID - Start ------------------------------------
function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function criticsArray(reviews) {
  const newArray = await Promise.all(reviews.map(insertCritic));
  return newArray;
}

async function insertCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

function readReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then(criticsArray);
}
// End review by id ------------------------------------------------------

module.exports = {
  list,
  read,
  readTheaters,
  readReviews,
};
