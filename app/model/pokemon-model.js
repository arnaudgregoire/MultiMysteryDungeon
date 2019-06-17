const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const AbilitySchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    }
});

const FormsSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    }
});

const Move_learn_methodSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    }
});

const MoveSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    },
    level_learn_at:{
        type:Number
    },
    move_learn_method:Move_learn_methodSchema
});

const StatSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    }
});

const TypeSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    }
})



const PokemonSchema = new Schema({
    abilities:
    [{
        ability: AbilitySchema,
        is_hidden:{
            type:Boolean
        },
        slot:{
            type:Number
        }
    }],
    base_experience:{
        type:Number
    },
    forms:[FormsSchema],
    height:{
        type:Number
    },
    is_default:{
        type:Boolean
    },
    moves:[{MoveSchema}],
    name:{
        type:String
    },
    stats:[{
        base_stat:{
            type:Number
        },
        effort:{
            type: Number
        },
        stat:StatSchema
    }],
    types:[{
        slot:{
            type:Number
        },
        type:TypeSchema
    }]
});

const PokemonModel = mongoose.model("Pokemon", PokemonSchema);

module.exports = PokemonModel;
