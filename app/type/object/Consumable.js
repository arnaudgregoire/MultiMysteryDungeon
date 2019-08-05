const Visible = require('./Visible');

/**
 * Abstract class for all Visible objects that can be consumed
 */
class Consumable extends Visible
{
     /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     * @param {MDO} type MDO type of object
     * @param {String} name Name of object
     * @param {String} description Description of object
     * @param {MDO_TILESET} look the key name associated to a pixel representation
     */
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look);
    }

    /**
     * Do the game consumption effect on the given player
     * This method return an error in case of missing real class implementation
     * @param {Player} player 
     */
    consume(player)
    {
        return new Error("Require missing kid class implementation method ");
    }
}

module.exports = Consumable;