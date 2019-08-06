const Ability = require('./ability');
const Move = require('./move');
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

        self.stats = {};
        self.efforts = {};

        self.stats.SPEED = doc.stats[0].base_stat;
        self.efforts.SPEED = doc.stats[0].effort;
        self.stats.SPECIAL_DEFENSE = doc.stats[1].base_stat;
        self.efforts.SPECIAL_DEFENSE = doc.stats[1].effort;
        self.stats.SPECIAL_ATTACK = doc.stats[2].base_stat;
        self.efforts.SPECIAL_ATTACK = doc.stats[2].effort;
        self.stats.DEFENSE = doc.stats[3].base_stat;
        self.efforts.DEFENSE = doc.stats[3].effort;
        self.stats.ATTACK = doc.stats[4].base_stat;
        self.efforts.ATTACK = doc.stats[4].effort;
        self.stats.HP = doc.stats[5].base_stat;
        self.efforts.HP = doc.stats[5].effort;
        

        self.types = [];
        doc.types.forEach((type) =>{
            self.types.push(new Type(type.slot, type.type))
        });
    }
}

module.exports = GenericPokemonDB;