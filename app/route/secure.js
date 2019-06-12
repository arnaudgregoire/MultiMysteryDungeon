const express = require("express");
const asynchronize = require("../middleware/asynchronize");
const PlayerModel = require("../model/player-model");

const router = express.Router();

router.post("/get-player", asynchronize(async (req, res, next) => {
  const users = await UserModel.find({}, "name highScore -_id").sort({ highScore: -1}).limit(10);
  res.status(200).json(users);
}));

module.exports = router;
