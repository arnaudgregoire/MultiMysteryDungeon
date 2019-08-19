const MDO = require('../../type/enums').MDO;

class Dungeon
{
    constructor(id, name, fileName, size, objects)
    {
        this.id = id;
        this.name = name;
        this.fileName = fileName;
        this.size = size;
        this.objects = objects;
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
            , MDO.PECHA_BERRY])
    }
}

module.exports = {Tiny_Woods}