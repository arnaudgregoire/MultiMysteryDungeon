const GenerationEngine = require('./engine/GenerationEngine');
const MDO = require('../type/enums').MDO;
const Rarity = require('../type/enums').ENUM_RARITY;
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
				items: [
					MDO.APPLE
					, MDO.RED_GUMMI
					, MDO.CHERI_BERRY
					, MDO.RAWST_BERRY
					, MDO.PECHA_BERRY
					]
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
		this.createMap();
		this.createObjects();
	}

	createMap()
	{	
		this.map = this.generator.generateMap();
		this.map = this.generator.addExtras(400);
	}
	
	createObjects()
	{
		this.objects = this.generator.generateObject();
	}
	
	static defaultExport() 
	{
		var tempmap=GenerationEngine.generateMap(config);
		return GenerationEngine.exportMapToCsv(addExtras(tempmap, 300), "app/generation/maps/testMap.csv");
	}
}

module.exports = Generation;
