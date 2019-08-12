const Edible = require('./Edible');
const MDO = require('../enums').MDO;
const MDO_LOOK = require('../enums').MDO_LOOK;
const ENUM_STATUS = require('../enums').ENUM_STATUS;

/**
 * Abstract class for all kind of berries
 */
class Berry extends Edible
{
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look, 5);
    }
}

/**
 * Abstract class for kind of berries that heals status
 */
class StatusBerry extends Berry
{
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look);
    }

    consume(player, healStatus)
    {
        super.consume(player);
        if(player.status == healStatus)
        {
            player.status = ENUM_STATUS.NORMAL;
        }
    }
}

/**
 * Abstract class for kind of berries that heals hp
 */
class HealBerry extends Berry
{
    constructor(x, y, type, name, description, look)
    {
        super(x, y, type, name, description, look);
    }

    consume(player, healValue)
    {
        super.consume(player);
        // TODO implement healing
    }
}

/**
 * Real Class implementation for object CHERI_BERRY
 */
class CheriBerry extends StatusBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.CHERI_BERRY
            , "Cheri Berry"
            , "A food item that heals the Pokémon from paralysis. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.CHERI_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, ENUM_STATUS.PARALYSIS);
    }
}

/**
 * Real Class implementation for object CHESTO_BERRY
 */
class ChestoBerry extends StatusBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.CHESTO_BERRY
            , "Chesto Berry"
            , "A food item that heals the Pokémon from sleep. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.CHESTO_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, ENUM_STATUS.SLEEP);
    }
}

/**
 * Real Class implementation for object PECHA_BERRY
 */
class PechaBerry extends StatusBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.PECHA_BERRY
            , "Pecha Berry"
            , "A food item that heals the Pokémon from poison. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.PECHA_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, ENUM_STATUS.POISON);
    }
}

/**
 * Real Class implementation for object RAWST_BERRY
 */
class RawstBerry extends StatusBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.RAWST_BERRY
            , "Rawst Berry"
            , "A food item that heals the Pokémon from burn. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.RAWST_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, ENUM_STATUS.BURN);
    }
}

/**
 * Real Class implementation for object ORAN_BERRY
 */
class OranBerry extends HealBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.ORAN_BERRY
            , "Oran Berry"
            , "A food item that heals 30 hp. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.ORAN_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, 30);
    }
}

/**
 * Real Class implementation for object SITRUS_BERRY
 */
class SitrusBerry extends HealBerry
{
    /**
     * 
     * @param {integer} x x position on map 
     * @param {integer} y y position on map
     */
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.SITRUS_BERRY
            , "Sitrus Berry"
            , "A food item that heals 100 hp. It also slightly fills the Pokémon's Belly."
            , MDO_LOOK.SITRUS_BERRY
        )
    }

    consume(player)
    {
        super.consume(player, 100);
    }
}

module.exports={CheriBerry, ChestoBerry, OranBerry, PechaBerry, RawstBerry, SitrusBerry}


