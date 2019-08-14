const Visible = require('./Visible');
const MDO_RARITY = require('../enums').ENUM_RARITY;

/**
 * Abstract class for collectable MDO object. A collectable object is an object that the player can be picked
 */
class Collectable extends Visible
{
    /**
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     * @param {MDO} type MDO type of object
     * @param {String} name Name of object
     * @param {String} description Description of object
     * @param {MDO_LOOK} look the key name associated to a pixel representation
     */
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look);
        this.collectable = true;
    }

    /**
     * By default, rarity is common
     */
    static getRarity()
    {
        return MDO_RARITY.COMMON;
    }
}

module.exports = Collectable;