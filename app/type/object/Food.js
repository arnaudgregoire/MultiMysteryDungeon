const Edible = require('./Edible');
const MDO = require('../enums').MDO;
const MDO_LOOK = require('../enums').MDO_LOOK;
const ENUM_STATUS = require('../enums').ENUM_STATUS;
const utils = require('../../engine/utils');

/**
 * Real Class implementation for object APPLE
 */
class Apple extends Edible
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.APPLE
            , "Apple"
            , "A food item that somewhat fills the Pokémon's Belly. Eating this when its Belly is full will slightly enlarge its Belly size"
            , MDO_LOOK.RED_APPLE
            , 50
        )
    }
}

/**
 * Real Class implementation for object GOLDEN_APPLE
 */
class GoldenApple extends Edible
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.GOLDEN_APPLE
            , "Golden Apple"
            , "A miraculous apple that glows with an alluring golden aura. It's far too precious and beautiful to even consider eating! If it were eaten, however, it would completely fill and greatly enlarge the Pokémon's Belly."
            , MDO_LOOK.GOLDEN_APPLE
            , 100
        )
    }
}

/**
 * Real Class implementation for object GRIMY_FOOD
 */
class GrimyFood extends Edible
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.GRIMY_FOOD
            , "Grimy Food"
            , "Slightly fills Belly, causes random status"
            , MDO_LOOK.GRIMY_FOOD
            , 20
        )
    }
    /**
     * Grim Food cause random status effect on consumption
     * @param {Player} player 
     */
    consume(player)
    {
        super.consume(player);
        player.status = Object.values(ENUM_STATUS)[utils.randomIntFromInterval(0, Object.values(ENUM_STATUS).length - 1)];
    }
}


module.exports = {Apple, GoldenApple, GrimyFood};