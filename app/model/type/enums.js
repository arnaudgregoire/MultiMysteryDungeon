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

const ENUM_MOVE_LEARN_METHOD = Object.freeze([
    "level-up",
    "tutor",
    "machine",
    "stadium-surfing-pikachu",
    "light-ball-egg",
    "colosseum-purification",
    "xd-shadow",
    "xd-purification",
    "form-change",
    "egg"
]);

const ENUM_GENDER = Object.freeze([
    "Male",
    "Female"
]);

module.exports= {
    ENUM_TYPE,
    ENUM_NATURE,
    ENUM_STAT,
    ENUM_MOVE_LEARN_METHOD,
    ENUM_GENDER
}