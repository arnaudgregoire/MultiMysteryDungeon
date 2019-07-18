const generateMap = require('./generation').generateMap;
const exportMapToCsv = require('./generation').exportMapToCsv;
const mapToString = require('./generation').mapToString;
const addExtras = require('./generation').addExtras;

let config =
{
	sizeX:50,	
	sizeY:50,	
	RoomCount:10,	
	minimumSize:3,	
	maximumSize:10
}

function defaultExport() {
	var tempmap=generateMap(config);
	return exportMapToCsv(addExtras(tempmap, 100), "app/generation/maps/testMap.csv");
}

module.exports = defaultExport;




