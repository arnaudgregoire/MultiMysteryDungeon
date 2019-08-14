const GenerationEngine = require('./engine/GenerationEngine');

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
				maximumSize:10
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
		this.createMap();
		this.createObjects();
	}

	createMap()
	{
		this.map = GenerationEngine.generateMap(this.config);
		this.map = GenerationEngine.addExtras(this.map, 400);
	}
	
	createObjects()
	{
		this.objects = 
		[
			{
			 "type":"APPLE",
			 "x":30,
			 "y":16
			}, 
			{

			 "type":"GOLDEN_APPLE",
			 "x":20,
			 "y":9
			}, 
			{
			 "type":"GRIMY_FOOD",
			 "x":27,
			 "y":43
			}, 
			{
			 "type":"CHERRI_BERRY",
			 "x":36,
			 "y":40
			}
		]
	}
	
	static defaultExport() 
	{
		var tempmap=GenerationEngine.generateMap(config);
		return GenerationEngine.exportMapToCsv(addExtras(tempmap, 300), "app/generation/maps/testMap.csv");
	}
}

module.exports = Generation;
