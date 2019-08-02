const Ability = require('./ability');
const Move = require('./move');
const Stat = require('./stat');
const Type = require('./type');

class GenericPokemonDB{
    constructor(doc){
        let self = this;
        self.abilities = [];
        doc.abilities.forEach(talent => {
            self.abilities.push({
                ability: new Ability(talent.ability.name, talent.ability.url),
                is_hidden: talent.is_hidden,
                slot: talent.slot
            })
        });
        self.baseExperience = doc.base_experience;
        self.moves = [];
        doc.moves.forEach((move) =>{
            self.moves.push(new Move(
                move.name,
                move.url,
                move.levelLearnedAt,
                move.move_learn_method                
            ))
        });
        self.name = doc.name;
        self.gameIndex = doc.game_index;
        self.stats = [];
        doc.stats.forEach((stat) =>{
            self.stats.push({
                stat: new Stat(stat.stat),
                baseStat: stat.base_stat,
                effort: stat.effort
            })
        })
        self.types = [];
        doc.types.forEach((type) =>{
            self.types.push(new Type(type.slot, type.type))
        });
    }
}

module.exports = GenericPokemonDB;