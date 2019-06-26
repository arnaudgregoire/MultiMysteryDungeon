const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  user_id:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  x:{
    type: Number,
    required: false
  },
  y:{
    type: Number,
    required: false
  },
  pokedex_idx: {
    type: Number,
    required: true
  },
  orientation:{
    type: String,
    required: false
  },
  action:{
    type: Number,
    required: false
  }
});

const playerModel = mongoose.model("player", PlayerSchema);

module.exports = playerModel;