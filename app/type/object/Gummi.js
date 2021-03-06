const MDO = require('../enums').MDO;
const MDO_LOOK = require('../enums').MDO_LOOK;
const MDO_RARITY = require('../enums').ENUM_RARITY;
const Edible = require('./Edible');

/**
 * Abstract class for all Gummies
 * A gummi restore 20 hunger
 */
class Gummi extends Edible
{
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look, 20);
    }

    static getRarity()
    {
        return MDO_RARITY.UNCOMMON;
    }
}

/**
 * Real Class implementation for object RED_GUMMI
 * TODO implement consume method that restore 60 instead in case of fire type
 */
class RedGummi extends Gummi
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
            , MDO.RED_GUMMI
            , 'Red Gummi'
            , 'Slightly fills Belly, raises IQ of fire types'
            , MDO_LOOK.RED_GUMMI
        )
    }
}

/**
 * Real Class implementation for object SILVER_GUMMI
 * TODO implement consume method that restore 60 instead in case of steel type
 */
class SilverGummi extends Gummi
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
            , MDO.SILVER_GUMMI
            , 'Red Gummi'
            , 'Slightly fills Belly, raises IQ of steel types'
            , MDO_LOOK.SILVER_GUMMI
        )
    }
}

module.exports = {RedGummi, SilverGummi};