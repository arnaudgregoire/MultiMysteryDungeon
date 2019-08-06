const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ENUMS = require("../type/enums");
const ENUM_STAT = ENUMS.ENUM_STAT;
const ENUM_NATURE = ENUMS.ENUM_NATURE;
const ENUM_TYPE = ENUMS.ENUM_TYPE;

const AbilitySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
});

const StatsSchema = new Schema({
    SPEED:{
        type:Number,
        required:true
    },
    SPECIAL_DEFENSE:{
        type:Number,
        required:true
    },
    SPECIAL_ATTACK:{
        type:Number,
        required:true
    },
    DEFENSE:{
        type:Number,
        required:true
    },
    ATTACK:{
        type:Number,
        required:true
    },
    HP:{
        type:Number,
        required:true
    }
});

const TypeSchema = new Schema({
    slot:{
        type:Number,
        required:true
    },
    type:{
        name:{
            type:String,
            enum: ENUM_TYPE,
            required:true
        },
        url:{
            type:String
        }
    }
});

const PokemonSchema = new Schema({
    level:{
        type: Number,
        required:true
    },
    ivs: StatsSchema,
    evs: StatsSchema,
    stats: StatsSchema,
    gender:{
        type:String,
        required:true
    },
    shiny:{
        type:Boolean,
        required:true
    },
    happiness:{
        type:Number,
        required:true
    },
    nature:{
        type:String,
        required:true,
        enum:ENUM_NATURE
    },
    name:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:false
    },
    types:[TypeSchema],
    ability:AbilitySchema,
    health:{
        type:Number,
        required:true
    },
    uniqid:{
        type:String,
        required:true
    },
    gameIndex:{
        type:Number,
        required:true
    }
});
const pokemonModel = mongoose.model("pokemon", PokemonSchema);

module.exports = pokemonModel;