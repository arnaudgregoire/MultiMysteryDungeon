const MDO = require('../../type/enums').MDO;
const MDO_TERRAIN = require('../../type/enums').MDO_TERRAIN;

class Dungeon
{
    /**
     * 
     * @param {String} id Uniqid generated
     * @param {String} name Name of the dungeon
     * @param {String} fileName File name to indacte which tileset to use in app/assets/tilesets
     * @param {Number} size Number of stages in this dungeon
     * @param {Array} objects Array of MDO Objects that can spawn in this dungeon
     * @param {MDO_TERRAIN} terrain type that indicate the nature of the new additional terrain (lava, water or abyss)
     */
    constructor(id, name, fileName, size, objects, terrain)
    {
        this.id = id;
        this.name = name;
        this.fileName = fileName;
        this.size = size;
        this.objects = objects;
        this.terrain = terrain;
    }
}

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
        )
    }
}

module.exports = {Tiny_Woods}