const generateMap = require('./generation').generateMap;
const exportMapToCsv = require('./generation').exportMapToCsv;
const mapToString = require('./generation').mapToString;

let config =
{
	sizeX:50,	
	sizeY:50,	
	RoomCount:10,	
	minimumSize:3,	
	maximumSize:10
}

exportMapToCsv(generateMap(config), "generation/maps/testMap.csv");



