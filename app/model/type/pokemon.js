const Stat = require('./stat');
const Type = require('./type');

class Pokemon{
    constructor(level, ivs, evs, stats, gender, shiny, happiness, nature, nickname, name, types, ability, health, uniqid){
        this.level = level;
        this.ivs = ivs;
        this.evs = evs;
        this.stats = stats;
        this.gender = gender;
        this.shiny = shiny;
        this.happiness = happiness;
        this.nature = nature;
        this.nickname = nickname;
        this.types = types;
        this.ability = ability;
        this.health = health;
        this.uniqid = uniqid;
        this.name = name;
    }
}

module.exports = Pokemon;