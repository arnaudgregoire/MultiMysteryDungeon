const Edible = require('./Edible');
const MDO = require('../enums').MDO;
const MDO_TILESET = require('../enums').MDO_TILESET;
const ENUM_STATUS = require('../enums').ENUM_STATUS;
const utils = require('../../engine/utils');

class Apple extends Edible
{
    constructor(x, y, id)
    {
        super(
            x
            , y
            , id
            , MDO.APPLE
            , "Apple"
            , "A food item that somewhat fills the Pokémon's Belly. Eating this when its Belly is full will slightly enlarge its Belly size"
            , MDO_TILESET.RED_APPLE
            , 50
        )
    }

    consume(player)
    {
        super.consume(player);
    }
}

class GoldenApple extends Edible
{
    constructor(x, y, id)
    {
        super(
            x
            , y
            , id
            , MDO.GOLDEN_APPLE
            , "Golden Apple"
            , "A miraculous apple that glows with an alluring golden aura. It's far too precious and beautiful to even consider eating! If it were eaten, however, it would completely fill and greatly enlarge the Pokémon's Belly."
            , MDO_TILESET.GOLDEN_APPLE
            , 100
        )
    }

    consume(player)
    {
        super.consume(player);
    }
}

class GrimyFood extends Edible
{
    constructor(x, y, id)
    {
        super(
            x
            , y
            , id
            , MDO.GRIMY_FOOD
            , "Grimy Food"
            , "Slightly fills Belly, causes random status"
            , MDO_TILESET.GRIMY_FOOD
            , 20
        )
    }

    consume(player)
    {
        super.consume(player);
        player.status = Object.values(ENUM_STATUS)[utils.randomIntFromInterval(0, Object.values(ENUM_STATUS).length - 1)];
    }
}


module.exports = {Apple, GoldenApple, GrimyFood};