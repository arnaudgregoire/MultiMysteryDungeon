/**
 * Abstract class for all MDO objects
 */
const uniqid = require('uniqid');

class MdoObject
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     * @param {String} id object identifier
     * @param {MDO} type MDO type of object
     * @param {String} name Name of object
     * @param {String} description Description of object
     */
    constructor(x, y, type, name, description)
    {
        this.x = x;
        this.y = y;
        this.id = uniqid();
        this.type = type;
        this.name = name;
        this.description = description;
    }
}

module.exports = MdoObject;
