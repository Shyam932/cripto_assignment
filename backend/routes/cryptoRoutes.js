const express = require('express');
const router = express.Router();
const {
  getMarketChart,
  getTopGainers,
  getTopLosers,
} = require('../controllers/cryptoController');

router.get('/market-chart/:id', getMarketChart);
router.get('/top-gainers', getTopGainers);
router.get('/top-losers', getTopLosers);

module.exports = router;
