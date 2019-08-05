const Food = require('./object/Food');
const Gummi = require('./object/Gummi');
const Berry = require('./object/Berry');
const MDO = require('./enums').MDO;

class MdoFactory{
    static createMdoObject(x, y, type)
    {
        switch (type) {
            case MDO.APPLE:
                return new Food.Apple(x, y);
        
            case MDO.GOLDEN_APPLE:
                return new Food.GoldenApple(x,y);
            
            case MDO.GRIMY_FOOD:
                return new Food.GrimyFood(x, y);

            case MDO.RED_GUMMI:
                return new Gummi.RedGummi(x, y);
            
            case MDO.SILVER_GUMMI:
                return new Gummi.SilverGummi(x, y);
            
            case MDO.CHERI_BERRY:
                return new Berry.CheriBerry(x, y);
            
            case MDO.CHESTO_BERRY:
                return new Berry.ChestoBerry(x, y);

            case MDO.ORAN_BERRY:
                return new Berry.OranBerry(x, y);

            case MDO.PECHA_BERRY:
                return new Berry.PechaBerry(x, y);

            case MDO.RAWST_BERRY:
                return new Berry.RawstBerry(x, y);

            case MDO.SITRUS_BERRY:
                return new Berry.SitrusBerry(x, y);
                
            default:
                return new Error('Object type not found');
        }
    }
}

module.exports = MdoFactory;