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

module.exports={
    computeStat,
    computeHP
}