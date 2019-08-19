const MDO_DUNGEON = require('../../type/enums').ENUM_DUNGEON;
const Dungeon = require('./Dungeon');

/**
 * Class meant to be called when generating a new dungeon
 */
class DungeonFactory
{
    static getDungeonFromType(type)
    {
        switch (type) {
            case MDO_DUNGEON.TINY_WOODS:
                return new Dungeon.Tiny_Woods();
        
            default:
                return new Error('no dungeon corresponding to given id');
        }
    }
}

module.exports = DungeonFactory;