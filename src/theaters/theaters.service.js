const res = require("express/lib/response");
const knex = require("../db/connection");

// List Theaters and movies showing - Start ----------------------
function listTheaters() {
  return knex("theaters as t")
    .select("*")
    .then((theaters) => Promise.all(theaters.map(addMovies)));
}

async function addMovies(theater) {
  theater.movies = await MoviesByTheater(theater.theater_id);
  return theater;
}

function MoviesByTheater(theaterId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("*")
    .where({ "mt.theater_id": theaterId });
}
// List Theaters end ----------------------------------------------

module.exports = {
  listTheaters,
  MoviesByTheater,
};
