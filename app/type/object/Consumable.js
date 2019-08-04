const MdoObject  = require('./MdoObject');

class Consumable extends MdoObject
{
    constructor(x, y)
    {
        super(x, y);
    }

    consume(player)
    {
        return new Error("Require missing kid class implementation method ");
    }
}

module.exports = Consumable;