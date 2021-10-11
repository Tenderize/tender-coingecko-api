const express = require('express');
const pairRoutes = require('./pair.route');
// const tickerRoutes = require('./ticker.route');
// const orderbookRoutes = require('./orderbook.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/pairs', pairRoutes);
// router.use('/tickers', tickerRoutes);
// router.use('/orderbook', orderbookRoutes);

module.exports = router;
