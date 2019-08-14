const GenerationEngine = require('./engine/GenerationEngine');
const Types = require('../type/enums').MDO;
const Rarity = require('../type/enums').ENUM_RARITY;

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
				itemConfig: {
					items: [
						{ type: Types.APPLE,
						  rarity: Rarity.COMMON
						},
						{ type: Types.RED_GUMMI,
						  rarity: Rarity.UNCOMMON
						},
						{ type: Types.CHERI_BERRY,
						  rarity: Rarity.RARE
						},
						{ type: Types.RAWST_BERRY,
						  rarity: Rarity.EPIC
						},
						{ type: Types.PECHA_BERRY,
						  rarity: Rarity.LEGENDARY
						}
					],
					itemCount: 5
				}
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
