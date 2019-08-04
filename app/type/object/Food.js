const Edible = require('./Edible');
const MDO = require('../enums').MDO;
const MDO_TILESET = require('../enums').MDO_TILESET;
const ENUM_STATUS = require('../enums').ENUM_STATUS;
const utils = require('../../engine/utils');

class Food extends Edible
{
    constructor(x, y, hungerValue)
    {
        super(x, y, hungerValue);
    }

    consume(player)
    {
        player.belly += this.hungerValue;
    }
}

class Apple extends Food
{
    constructor(x, y)
    {
        super(x, y, 50);
        this.type = MDO.APPLE;
        this.id = MDO_TILESET.RED_APPLE;
        this.name = "Apple";
        this.description = "A food item that somewhat fills the Pokémon's Belly. Eating this when its Belly is full will slightly enlarge its Belly size";
    }
}

class GoldenApple extends Food
{
    constructor(x, y)
    {
        super(x, y, 100);
        this.type = MDO.GOLDEN_APPLE;
        this.id = MDO_TILESET.GOLDEN_APPLE;
        this.name = "Golden Apple";
        this.description = "A miraculous apple that glows with an alluring golden aura. It's far too precious and beautiful to even consider eating! If it were eaten, however, it would completely fill and greatly enlarge the Pokémon's Belly.";
    }
}

class GrimyFood extends Food
{
    constructor(x, y)
    {
        super(x, y, 20);
        this.type = MDO.GRIMY_FOOD;
        this.id = MDO_TILESET.GRIMY_FOOD;
        this.name = "Grimy Food";
        this.description = "Slightly fills Belly, causes random status";
    }
    consume(player)
    {
        super.consume(player);
        player.status = Object.values(ENUM_STATUS)[utils.randomIntFromInterval(0, Object.values(ENUM_STATUS).length - 1)];
    }
} 

module.exports = {Apple, GoldenApple, GrimyFood};