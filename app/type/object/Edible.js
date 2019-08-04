const MdoObject  = require('./Consumable');

class Edible extends Consumable
{
    constructor(x, y, hungerValue)
    {
        super(x, y);
        this.hungerValue = hungerValue;
    }
}

module.exports = Edible;