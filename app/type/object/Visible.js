const MdoObject = require('./MdoObject');

class Visible extends MdoObject
{
    constructor(x, y, id, type, name, description, look)
    {
        super(x, y, id, type, name, description);
        this.look = look;
    }
}

module.exports = Visible;