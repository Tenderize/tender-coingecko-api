const express = require('express');
const controller = require('../../controllers/pair.controller');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/pairs List Pairs
   * @apiDescription Get a list of pairs
   * @apiVersion 1.0.0
   * @apiName ListPairs
   * @apiGroup Pairs
   * @apiPermission all
   *
   * @apiSuccess {Object[]} users List of pairs.
   */
  .get(controller.list);

module.exports = router;
