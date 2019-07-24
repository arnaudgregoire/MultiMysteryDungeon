const MODIFIER_NATURE = require("../model/type/enums").MODIFIER_NATURE;

/**
 * https://www.pokepedia.fr/Calcul_des_statistiques
 * @param {string} stat 
 * @param {integer} base 
 * @param {integer} iv 
 * @param {integer} ev 
 * @param {integer} level 
 * @param {string} nature 
 */
function computeStat(stat,base,iv,ev,level,nature){
    let value = 2 * base + iv + Math.floor(ev/4);
    value = value * level;
    value = value / 100;
    value =  value + 5;
    value = Math.floor(value * MODIFIER_NATURE[nature][stat]);
    return value;
}

function computeHP(base,iv,ev,level){
    let value = base + iv;
    value = value * 2;
    value = value + Math.floor(Math.sqrt(ev) / 4);
    value = value * level;
    value = Math.floor(value / 100);
    value = value + level + 10;
    return value;
}

/**
 * https://www.pokepedia.fr/Calcul_des_d%C3%A9g%C3%A2ts
 * @param {*} level level of attacking pokemon
 * @param {*} attack attack stat of attacking pokemon
 * @param {*} def def of attacked pokemon
 * @param {*} power base power of the attack move
 * @param {*} cm coeff multiplicateur (stab * efficacité * random between 0.85 and 1 * others possibles)
 */
function computeDamage(level, attack, def, power, cm){
    let value = level * 0.4 + 2;
    value = value * attack;
    value = value * power;
    value = value / (def * 50);
    value = value + 2;
    value = Math.floor(value);
    value = value * cm;
    return value;
}

function getCM(typesAttack, typesDefense, typeMove){
}

module.exports={
    computeStat,
    computeHP,
    computeDamage
}