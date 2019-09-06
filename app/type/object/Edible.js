const Consumable  = require('./Consumable');

/**
 * Abstract Class for all visible consumable object that are edible
 */
class Edible extends Consumable
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     * @param {MDO} type MDO type of object
     * @param {String} name Name of object
     * @param {String} description Description of object
     * @param {MDO_LOOK} look the key name associated to a pixel representation
     * @param {integer} hungerValue the hunger value that this object restore to player's belly
     */
    constructor(x, y, type, name, description, look, hungerValue)
    {
        super(x, y, type, name, description, look);
        this.hungerValue = hungerValue;
        this.edible = true;
    }

    /**
     * Add Hunger value of Object to given player's belly
     * @param {Player} player 
     */
    consume(player)
    {
        player.belly += this.hungerValue;
        player.belly = Math.min(player.belly, 100);
    }
}

module.exports = Edible;