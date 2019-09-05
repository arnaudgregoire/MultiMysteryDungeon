const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ENUM_STATUS = require('../type/enums').ENUM_STATUS;
const ENUM_MDO = require('../type/enums').MDO;

const ObjectSchema = new Schema({
  x:{
    type:Number,
    required:true
  },
  y:{
    type:Number,
    required:true
  },
  id:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true,
    enum : Object.values(ENUM_MDO)
  }
})

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
  pokemon_id: {
    type: String,
    required: true
  },
  orientation:{
    type: String,
    required: false
  },
  action:{
    type: Number,
    required: false
  },
  belly:{
    type: Number,
    required:true
  },
  mapId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true,
    enum:Object.values(ENUM_STATUS)
  },
  inventory:[ObjectSchema],
  stageCompleted:{
    type:Boolean,
    required:true
  }
});

const playerModel = mongoose.model("player", PlayerSchema);

module.exports = playerModel;