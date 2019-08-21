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

const Rarities = require('../../type/enums').ENUM_RARITY;
const MDO = require('../../type/enums').MDO;
const MdoFactory = require('../../type/MdoFactory');
/*

Function to generate the map of items of a level + spawn point of player + location of stairs

This is not over, this shouldn't work for now, but the global idea is here
EDIT: This is better, yet still not perfect

Lots of refactoring to do
EDIT: Less of refactoring

format of input config : a list of items (rarity should be a member of item, otherwise some modifications will be needed) and a number of items to spawn (player spawn point and stairs position excluded)

*/
class ItemGeneration{
	
	static addItems(roomList,items,numberOfItems)
	{
		var itemList = [];

		for(let i=0;i<numberOfItems;i++)
		{
			var itemToSpawn = 
			{
				x : 0,
				y : 0,
				type : null
			}
			var itemOfCurrentRarityList = [];
			var IsThereAValidItem = false;
			while(!IsThereAValidItem){
				const rarity = ItemGeneration.computeSpawnRarity();
				for(let j=0;j< items.length;j++)
				{
					if(MdoFactory.getRarity(items[j]) == rarity)
					{
						itemOfCurrentRarityList.push(items[j]);
					}
				}
				if(itemOfCurrentRarityList.length>0){
					IsThereAValidItem=true;
				}
			}
			const itemNumberToSpawn = Math.floor((Math.random()*itemOfCurrentRarityList.length));
			const roomNumber = Math.floor((Math.random()*roomList.length));
			const spawnPointX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
			const spawnPointY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
			let isPositionFree = true;
			itemList.forEach(item=>
				{
				if((item.x==spawnPointX)&&(item.y==spawnPointY))
				{
					isPositionFree = false;
				}
			})
			if(isPositionFree)
			{
				itemToSpawn.x = spawnPointX;
				itemToSpawn.y = spawnPointY;
				itemToSpawn.type = itemOfCurrentRarityList[itemNumberToSpawn];
				itemList.push(itemToSpawn);
			} else 
			{
				i--;
			}
		}
		var playerSpawnPoint = {
			x: 0,
			y: 0,
			type: MDO.SPAWN_POINT_PLAYER
		}
		
		var stairsPosition = {
			x: 0,
			y: 0,
			type: MDO.DOWNSTAIRS
		}
		
		let isPlayerSpawnPointValid = false;
		let isStairsPositionValid = false;
		
		while(!isPlayerSpawnPointValid)
		{
			const roomNumber = Math.floor((Math.random()*roomList.length));
			const playerSpawnPointX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
			const playerSpawnPointY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
			isPlayerSpawnPointValid = true;

			itemList.forEach(item=>
				{
				if((item.x==playerSpawnPointX)&&(item.y==playerSpawnPointY)){
					isPlayerSpawnPointValid = false;
				}
			});
			if(isPlayerSpawnPointValid)
			{
				playerSpawnPoint.x = playerSpawnPointX;
				playerSpawnPoint.y = playerSpawnPointY;
				itemList.push(playerSpawnPoint);
			}
		}
		
		while(!isStairsPositionValid)
		{
			const roomNumber = Math.floor((Math.random()*roomList.length));
			const stairsLocationX = Math.floor((Math.random()*roomList[roomNumber].sizeX)+roomList[roomNumber].posX);
			const stairsLocationY = Math.floor((Math.random()*roomList[roomNumber].sizeY)+roomList[roomNumber].posY);
			isStairsPositionValid = true;
			itemList.forEach(item=>
				{
				if((item.x==stairsLocationX)&&(item.y==stairsLocationY)){
					isStairsPositionValid = false;
				}
			});
			if(isStairsPositionValid)
			{
				stairsPosition.x = stairsLocationX;
				stairsPosition.y = stairsLocationY;
				itemList.push(stairsPosition);
			}
		}
		return itemList;
	}

	/*
	Function to randomly compute the rarity level of an item to spawn
	TODO : Refactor this function to remove everything that is hardcoded
	*/
	static computeSpawnRarity()
	{
		
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
}

module.exports = ItemGeneration;