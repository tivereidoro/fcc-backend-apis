import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = (req.headers && req.headers.authorization) || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    // Read the secret at call time so the middleware picks up the value that is
    // set in the environment when the request is handled.
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
