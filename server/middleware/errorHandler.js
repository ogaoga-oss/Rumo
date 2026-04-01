function errorHandler(err, req, res, next) {
  console.error("エラー発生:", err);

  res.status(err.status || 500).json({
    error: err.message || "サーバーエラー"
  });
}

module.exports = errorHandler;
