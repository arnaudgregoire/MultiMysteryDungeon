const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const PlayerModel = require('../models/playerModel');

const router = express.Router();


router.post('/get-player', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
  res.status(200).json(users);
}));

module.exports = router;
