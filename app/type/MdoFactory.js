const Food = require('./object/Food');
const MDO = require('./enums').MDO;

class MdoFactory{
    static createMdoObject(x, y, type)
    {
        switch (type) {
            case MDO.APPLE:
                return new Food.Apple(x, y);
        
            case MDO.GOLDEN_APPLE:
                return new Food.GoldenApple(x,y);
                
            default:
                return new Error('Object type not found');
        }
    }
}

module.exports = MdoFactory;