const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ENUM_STAT = Object.freeze([
    "speed",
    "special-defense",
    "special-attack",
    "defense",
    "attack",
    "hp"
]);

const ENUM_NATURE = Object.freeze([
    "Adamant",
    "Bashful",
    "Bold",
    "Brave",	
    "Calm",
    "Careful",
    "Docile",
    "Gentle",
    "Hardy",
    "Hasty",
    "Impish",
    "Jolly",
    "Lax",
    "Lonely",
    "Mild",
    "Modest",
    "Naive",
    "Naughty",
    "Quiet",
    "Quirky",
    "Rash",
    "Relaxed",
    "Sassy",
    "Serious",
    "Timid"
]);

const ENUM_TYPE = Object.freeze([
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
    "unknown",
    "shadow"    
]);
const PokemonSchema = new Schema({
    level:{
        type: Number,
        required:true
    },
    iv:[IvSchema],
    ev:[EvSchema],
    stats:[StatSchema],
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
        required:true
    },
    types:[TypeSchema],
    ability:AbilitySchema
});


const AbilitySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String
    }
});

const StatSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
        type:Number,
        required:true
    }
});

const IvSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
        type:Number,
        required:true
    }
});

const EvSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
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

const pokemonModel = mongoose.model("player", PokemonSchema);

module.exports = pokemonModel;