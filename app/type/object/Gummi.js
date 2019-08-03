const MDO = require('../enums').MDO;
const MDO_TILESET = require('../enums').MDO_TILESET;
const Edible = require('./Edible');


class RedGummi extends Edible
{
    constructor(x, y)
    {
        super(x, y, 20);
        this.name = 'Red Gummi';
        this.description = 'Slightly fills Belly, raises IQ of fire types';
        this.type = MDO.RED_GUMMI;
        this.id = MDO_TILESET.RED_GUMMI;
    }
}

class SilverGummi extends Edible
{
    constructor(x, y)
    {
        super(x, y, 20);
        this.name = 'Silver Gummi';
        this.description = 'Slightly fills Belly, raises IQ of steel types';
        this.type = MDO.SILVER_GUMMI;
        this.id = MDO_TILESET.RED_GUMMI;
    }
}

module.exports = {RedGummi, SilverGummi};