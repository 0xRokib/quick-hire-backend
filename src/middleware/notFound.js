// src/middleware/notFound.js — 404 catch-all middleware
const notFound = (req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
};

export default notFound;
