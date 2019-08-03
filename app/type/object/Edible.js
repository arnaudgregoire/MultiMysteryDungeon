const MdoObject  = require('./MdoObject');

class Edible extends MdoObject
{
    constructor(x, y, hungerValue)
    {
        super(x, y);
        this.hungerValue = hungerValue;
    }
}

module.exports = Edible;