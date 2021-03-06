const MDO = require('../../type/enums').MDO;
const MDO_TERRAIN = require('../../type/enums').MDO_TERRAIN;

class Dungeon
{
    /**
     * 
     * @param {String} id Uniqid generated
     * @param {String} name Name of the dungeon
     * @param {String} fileName File name to indacte which tileset to use in app/assets/tilesets
     * @param {Number} floors Number of stages in this dungeon
     * @param {Array} objects Array of MDO Objects that can spawn in this dungeon
     * @param {MDO_TERRAIN} terrain type that indicate the nature of the new additional terrain (lava, water or abyss)
     * @param {Encounter} encounters 
     * @param {Array} moneyRange Range of money obtainable
     */
    constructor(id, name, fileName, floors, objects, terrain, encounters, moneyRange)
    {
        this.id = id;
        this.name = name;
        this.fileName = fileName;
        this.floors = floors;
        this.objects = objects;
        this.terrain = terrain;
        this.encounters = encounters;
        this.moneyRange = moneyRange;
    }
}

class Encounter
{
    /**
     * 
     * @param {String} name Name of the pokemon, lower case ex : scyther
     * @param {Array} floors Range of floors where the pokemon spawn ex : [8,11]
     * @param {Array} levels level that the pokemon can have ex : [10,13]
     * @param {*} recruitRate Recruit rate in %
     */
    constructor(name, floors, levels, recruitRate)
    {
        this.name = name;
        this.floors = floors;
        this.levels = levels;
        this.recruitRate = recruitRate;
    }
}

/**
 * https://bulbapedia.bulbagarden.net/wiki/Tiny_Woods
 */
class Tiny_Woods extends Dungeon
{
    constructor()
    {
        super(
        "TINY_WOODS"
        , "Tiny Woods"
        , "tiny_woods.png"
        , 3
        , [MDO.APPLE
            , MDO.CHERI_BERRY
            , MDO.PECHA_BERRY]
        , MDO_TERRAIN.WATER
        , [
            new Encounter('pidgey',[1,3],[1],0)
            , new Encounter('caterpie',[1,3],[1],0)
            , new Encounter('weedle',[1,3],[1],0)
        ],
        [4,38])
    }
}

module.exports = {Tiny_Woods}