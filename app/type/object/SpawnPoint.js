const MdoObject = require('./MdoObject');
const MDO = require('../enums').MDO;
const MDO_LOOK = require('../enums').MDO_LOOK;

class SpawnPoint extends MdoObject
{
}

class SpawnPointPlayer extends SpawnPoint
{
    constructor()
    {
        super(x
            , y
            , MDO.SPAWN_POINT_PLAYER
            , "Player Spawn Point"
            , "Coordinates where players spawn at the entry of a new stage"
        )
    }
}

class SpawnPointIa extends SpawnPoint
{
    constructor()
    {
        super(x
            , y
            , MDO.SPAWN_POINT_IA
            , "IA Spawn Point"
            , "Coordinates where ias can spawn"
        )
    }
}

module.exports = {SpawnPointPlayer, SpawnPointIa};