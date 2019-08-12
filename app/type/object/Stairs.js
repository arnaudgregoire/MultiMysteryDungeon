const Visible = require('./Visible');
const MDO = require('../enums').MDO;
const MDO_TILESET = require('../enums').MDO_TILESET;

/**
 * Abstract class for down stairs and up stairs
 */
class Stairs extends Visible
{
}

/**
 * Real class implementation for upstairs case
 */
class UpStairs extends Stairs
{
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.UPSTAIRS
            , 'Upstairs'
            , 'Those stairs leads to the next stage'
            , MDO_TILESET.UPSTAIRS
        )
    }
}

/**
 * Real class implementation for downstairs case
 */
class DownStairs extends Stairs
{
    constructor(x, y)
    {
        super(
            x
            , y
            , MDO.DOWNSTAIRS
            , 'Upstairs'
            , 'Those stairs leads to the next stage'
            , MDO_TILESET.DOWNSTAIRS
        )
    }
}

module.exports = {UpStairs,DownStairs};