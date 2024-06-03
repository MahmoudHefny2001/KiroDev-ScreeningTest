const Movie = require("../models/moviesModel");
const  fs = require("fs");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const movies = await Movie.find()
    .limit(parseInt(req.query.limit) || 10)
    .skip(parseInt(req.query.offset) || 0);
  res.status(200).json({
    status: "success",
    data:  movies ,
  });
});

exports.createMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = asyncErrorHandler(async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { movie: updatedMovie },
  });
});

exports.deleteMovie = asyncErrorHandler(async (req, res) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// this function is responsible for getting movies by genre then writing the result to a file and sending the result to the client
// can you manipulate aggregation to get the count of movies in each genre (there are formated example in result.txt in the log folder)
// bouns: is there a better way to optimize performance 


exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
  try {
    const movies = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movies: { $push: "$name" },
          movieCount: { $sum: 1 },    // counting the number of movies in each genre 
        },
      },
      { $addFields: { genre: "$_id" } },
      { $project: { _id: 0, genres: 1, movies: 1, movieCount: 1 } },
      { $sort: { movieCount: -1 } },  
    ]);

    await fs.promises.writeFile("./log/result.txt", JSON.stringify(movies), { flag: "a" });
    // using promises to write to file asynchronously to avoid blocking the server and improve performance

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    next(error);
  }
  
});