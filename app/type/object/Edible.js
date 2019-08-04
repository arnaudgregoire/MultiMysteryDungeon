const Consumable  = require('./Consumable');

class Edible extends Consumable
{
    constructor(x, y, id, type, name, description, look, hungerValue)
    {
        super(x, y, id, type, name, description, look);
        this.hungerValue = hungerValue;
    }

    consume(player)
    {
        player.belly += this.hungerValue;
    }
}

module.exports = Edible;