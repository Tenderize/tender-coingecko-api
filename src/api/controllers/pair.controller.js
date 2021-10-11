const getPairs = require('../models/pairs.model');
const networks = require('../../config/netwroks');

/**
 * Get pair list
 * @public
 */
exports.list = async (req, res, next) => {
  const promises = [];
  for (let i = 0; i < networks.length; i += 1) {
    promises.push(getPairs(networks[i]));
  }
  res.json([].concat(...(await Promise.all(promises))));
};
