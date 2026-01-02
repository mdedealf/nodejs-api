import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // Verify movie exists in the database
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({
      success: false,
      status: "error",
      message: "Movie not found",
      data: null,
    });
  }

  // Check if already added to watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: { userId_movieId: { userId: req.user.id, movieId: movieId } },
  });

  if (existingInWatchlist) {
    return res.status(400).json({
      success: false,
      status: "error",
      message: "Movie already in watchlist",
      data: null,
    });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    success: true,
    status: "success",
    message: "Successfully added to watchlist",
    data: {
      watchlistItem,
    },
  });
};

/**
 * Remove movie from watchlist
 * Deletes watchlist item
 * Ensures only owner can delete
 * Requires protect middleware
 */
const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      success: false,
      status: "error",
      message: "Watchlist item not found",
    });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      status: "error",
      message: "Not authorized to delete this watchlist item",
    });
  }

  await prisma.watchlistItem.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    success: true,
    status: "success",
    message: "Watchlist item removed successfully",
  });
};

/**
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watichlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watichlistItem) {
    return res.status(404).json({
      success: false,
      status: "error",
      message: "Watchlist item not found",
    });
  }

  // Ensure only owner can update
  if (watichlistItem.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      status: "error",
      message: "Not authorized to update this watchlist item",
    });
  }

  // Build update data object
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    status: "success",
    message: "Watchlist item updated successfully",
    data: { watchlistItem: updatedItem },
  });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };
