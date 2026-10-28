export function authorizeModification(req, res, next) {
  const { id, role } = req.user || {};
  const { userId } = req.params || {};

  // Parents may modify any watchlist; children only their own. Ids are compared
  // as strings because route params arrive as strings and token ids as numbers.
  if (role === "parent") {
    return next();
  }

  if (role === "child" && String(id) === String(userId)) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}
