const GenerationEngine = require('./engine/GenerationEngine');
const MDO = require('../type/enums').MDO;
const MDO_TERRAIN = require('../type/enums').MDO_TERRAIN;
const uniqid = require('uniqid');

class Generation
{
	constructor(config)
	{
		if(config === undefined)
		{
			this.config =
			{
				sizeX:50,
				sizeY:50,
				RoomCount:10,
				minimumSize:3,	
				maximumSize:10,
				numberOfItems:10,
				items: [
					MDO.APPLE
					, MDO.RED_GUMMI
					, MDO.CHERI_BERRY
					, MDO.RAWST_BERRY
					, MDO.PECHA_BERRY
					],
				terrain: MDO_TERRAIN.WATER
			}
		}
		else
		{
			this.config = config;
		}
		this.map = [];
		this.objects = [];
	}

	generate()
	{
		this.generator = new GenerationEngine(this.config);
		this.id = uniqid();
		console.log('generating map...');
		this.createMap();
		console.log('generating objects...');
		this.createObjects();
	}

	createMap()
	{	
		this.map = this.generator.generateMap();
		console.log('generating additional terrains...')
		this.map = this.generator.addExtras(400, this.config.terrain);
	}
	
	createObjects()
	{
		this.objects = this.generator.generateObject();
	}

}

module.exports = Generation;
