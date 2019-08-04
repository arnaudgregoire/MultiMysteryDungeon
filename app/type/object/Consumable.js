const Visible = require('./Visible');

class Consumable extends Visible
{
    constructor(x, y, id, type, name, description, look)
    {
        super(x, y, id, type, name, description, look);
    }

    consume(player)
    {
        return new Error("Require missing kid class implementation method ");
    }
}

module.exports = Consumable;