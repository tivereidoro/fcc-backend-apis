import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  addMovie,
  deleteMovie,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

// Reading is open to any authenticated user, regardless of role.
router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ watchlist });
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { title, genre } = req.body || {};

  if (!title || !genre) {
    return res.status(400).json({ error: "Title and genre are required." });
  }

  const movie = addMovie(Number(req.params.userId), { title, genre });

  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body || {},
  );

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  return res.json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const removed = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );

  if (!removed) {
    return res.status(404).json({ error: "Movie not found" });
  }

  return res.json({ success: true });
});

export default router;
