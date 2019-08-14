const Food = require('./object/Food');
const Gummi = require('./object/Gummi');
const Berry = require('./object/Berry');
const Stairs  = require('./object/Stairs');
const MDO = require('./enums').MDO;

class MdoFactory{
    /**
     * Get Rarity of a collectable object
     * @param {String} type MDO type, must be collectable 
     */
    static getRarity(type)
    {
        switch (type) {
            case MDO.APPLE:
                return Food.Apple.getRarity();
        
            case MDO.GOLDEN_APPLE:
                return Food.GoldenApple.getRarity();
            
            case MDO.GRIMY_FOOD:
                return Food.GrimyFood.getRarity();

            case MDO.RED_GUMMI:
                return Gummi.RedGummi.getRarity();
            
            case MDO.SILVER_GUMMI:
                return Gummi.SilverGummi.getRarity();
            
            case MDO.CHERI_BERRY:
                return Berry.CheriBerry.getRarity();
            
            case MDO.CHESTO_BERRY:
                return Berry.ChestoBerry.getRarity();

            case MDO.ORAN_BERRY:
                return Berry.OranBerry.getRarity();

            case MDO.PECHA_BERRY:
                return Berry.PechaBerry.getRarity();

            case MDO.RAWST_BERRY:
                return Berry.RawstBerry.getRarity();

            case MDO.SITRUS_BERRY:
                return Berry.SitrusBerry.getRarity();
                
            default:
                return new Error('Object type not found');
        }
    }

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

            case MDO.DOWNSTAIRS:
                return new Stairs.DownStairs(x, y);
            
            case MDO.UPSTAIRS:
                return new Stairs.UpStairs(x, y);
                
            default:
                return new Error('Object type not found');
        }
    }
}

module.exports = MdoFactory;