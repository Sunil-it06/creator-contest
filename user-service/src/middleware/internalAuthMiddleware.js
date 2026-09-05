const internalAuthMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-internal-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Internal API key required",
    });
  }

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid internal API key",
    });
  }

  next();
};

module.exports = internalAuthMiddleware;