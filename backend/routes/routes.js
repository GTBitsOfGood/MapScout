// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Handle 404
 */
router.get('*', (req, res) => {
  res.status(404).send({
    success: false,
    error: "Unmatched route",
  });
});

// Export the router
module.exports = router;
