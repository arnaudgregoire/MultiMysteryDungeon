const MdoObject = require('./MdoObject');
const MDO = require('../enums').MDO;
class SpawnPoint extends MdoObject
{
}

class SpawnPointPlayer extends SpawnPoint
{
    constructor(x, y)
    {
        super(x
            , y
            , MDO.SPAWN_POINT_PLAYER
            , "Player Spawn Point"
            , "Coordinates where players spawn at the entry of a new stage"
        )
    }
}


module.exports = {SpawnPointPlayer};