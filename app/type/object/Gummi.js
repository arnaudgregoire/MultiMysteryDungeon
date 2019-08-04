const MDO = require('../enums').MDO;
const MDO_TILESET = require('../enums').MDO_TILESET;
const Edible = require('./Edible');

class Gummi extends Edible
{
    constructor(x, y, id, type, name, description, look)
    {
        super(x, y, id, type, name, description, look, 20);
    }
    
    consume(player)
    {
        super.consume(player);
    }
}

class RedGummi extends Gummi
{
    constructor(x, y, id)
    {
        super(
            x
            , y
            , id
            , MDO.RED_GUMMI
            , 'Red Gummi'
            , 'Slightly fills Belly, raises IQ of fire types'
            , MDO_TILESET.RED_GUMMI
        )
    }

    consume(player)
    {
        super.consume(player);
    }
}


class SilverGummi extends Gummi
{
    constructor(x, y, id)
    {
        super(
            x
            , y
            , id
            , MDO.SILVER_GUMMI
            , 'Red Gummi'
            , 'Slightly fills Belly, raises IQ of steel types'
            , MDO_TILESET.SILVER_GUMMI
        )
    }

    consume(player)
    {
        super.consume(player);
    }
}

module.exports = {RedGummi, SilverGummi};