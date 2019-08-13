/*

Generation of the item map of the level

content of the map : items, spawn point of players and ennemies, exit stairs...

input : config object containing item types and rarity, and number of items to spawn 

output : list of following elements : {x,y,type} where :
	x, y is the position of the objct in the map
	type is the type of item
	
author : surprisingly NOT Arnaud.Gregoire
date : far too late



*/

const Rarities = requires('../type/enums').ENUM_RARITY;
const Types = requires('../type/enums').MDO;

/*

Function to generate the map of items of a level + spawn point of player + location of stairs

This is not over, this shouldn't work for now, but the global idea is here
EDIT: This is better, yet still not perfect

Lots of refactoring to do
EDIT: Less of refactoring

format of input config : a list of items (rarity should be a member of item, otherwise some modifications will be needed) and a number of items to spawn (player spawn point and stairs position excluded)

*/
function addItems(roomList,config){
	
	const numberOfItems = config.itemCount;
	
	var itemList = [];
	
	for(i=0;i<numberOfItems;i++){
		
		var itemToSpawn = {
			posX : 0,
			posY : 0,
			type : null
		}
		
		const rarity = computeSpawnRarity();
		var itemOfCurrentRarityList = [];
		
		for(j=0,j<config.items.length,j++){
			
			if(config.items[j].rarity == rarity){
				itemOfCurrentRarityList.push(config.items[j]);
			}
		}
		
		const itemNumberToSpawn = Math.floor((Math.random()*itemOfCurrentRarityList.length));
		
		const roomNumber = Math.floor((Math.random()*roomList.length));
		
		const spawnPointX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
		const spawnPointY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
		
		boolean isPositionFree=true;
		
		for(item in itemList){
			if((item[0]==spawnPointX)&&(item[1]==spawnPointY)){
				isPositionFree = false;
			}
		}
		
		if(isPositionFree){
			itemToSpawn.posX = spawnPointX;
			itemToSpawn.posY = spawnPointY;
			itemToSpawn.type = itemOfCurrentRarityList[itemNumberToSpawn].type;
			itemList.push(itemToSpawn);
		} else {
			i--;
		}
		
		
	}
	
	var playerSpawnPoint = {
		posX: 0,
		posY: 0,
		type: Types.SPAWN_POINT_PLAYER
	}
	
	var stairsPosition = {
		posX: 0,
		posY: 0,
		type: Types.DOWNSTAIRS
	}
	
	bool isPlayerSpawnPointValid = false;
	bool isStairsPositionValid = false;
	
	while(!isPlayerSpawnPointValid){
		
		const roomNumber = Math.floor((Math.random()*roomList.length));
		
		const playerSpawnPointX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
		const playerSpawnPointY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
		
		isPlayerSpawnPointValid = true;
		for(item in itemList){
			if((item[0]==playerSpawnPointX)&&(item[1]==playerSpawnPointY)){
				isPlayerSpawnPointValid = false;
			}
		}
		if(isPlayerSpawnPointValid){
			playerSpawnPoint.posX = playerSpawnPointX;
			playerSpawnPoint.posY = playerSpawnPointY;
			itemList.push(playerSpawnPoint);
		}
	}
	
	while(!isStairsPositionValid){
		
		const roomNumber = Math.floor((Math.random()*roomList.length));
		
		const stairsLocationX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
		const stairsLocationY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
		
		isStairsPositionValid = true;
		for(item in itemList){
			if((item[0]==stairsLocationX)&&(item[1]==stairsLocationY)){
				isStairsPositionValid = false;
			}
		}
		if(isStairsPositionValid){
			stairsPosition.posX = stairsLocationX;
			stairsPosition.posY = stairsLocationY;
			itemList.push(stairsPosition);
		}
	}
	
	
	
	return itemList;
	
	
}





/*

Function to randomly compute the rarity level of an item to spawn

TODO : Refactor this function to remove everything that is hardcoded

*/
function computeSpawnRarity(){
	
	const spawnValue = Math.floor((Math.random()*100)+1);
	var rarity;
	
	if (spawnValue>99){
		rarity = Rarities.LEGENDARY;
	} else if(spawnValue>95){
		rarity = Rarities.EPIC;
	} else if(spawnValue>80){
		rarity = Rarities.RARE;
	} else if(spawnValue>50){
		rarity = Rarities.UNCOMMON;
	} else {
		rarity = Rarities.COMMON;
	}
	
	return rarity;
	
}