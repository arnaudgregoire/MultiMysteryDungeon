// fichier contenant le code de la generation procedurale de map 

/*
Doc de la config de generateMap :

sizeX: taille de la carte ( abcisse )
sizeY: taille de la carte ( ordonnees )

RoomCount: nombre de salles

minimumSize: taille minimale d'une salle ( taille en X ou en Y )
maximumSize: taille maximale d'une salle ( taille en X ou en Y )
*/

const Delaunator = require('delaunator');
const Room = require('./room');
var fs = require('fs');
const Items = require('./itemGeneration');



class GenerationEngine{

	constructor(config)
	{
		this.config = config;
		this.rooms = [];
		this.corridors = [];
		this.roomNumberCreated = 0;
		this.map = [];
		this.map =new Array(this.config.sizeY);
		for (var i=0; i<this.config.sizeY; i++)
		{
			this.map[i]=new Array(this.config.sizeX);
			for (var j=0; j<this.config.sizeX; j++)
			{
				this.map[i][j]=0;
			}
		}
	}

	
	generateMap(){
		while(this.roomNumberCreated<this.config.RoomCount)
		{
			var A=getRandomInt(this.config.sizeY-this.config.minimumSize-1)+1
			var B=getRandomInt(this.config.sizeX-this.config.minimumSize-1)+1
			var C = getRandomInt(this.config.maximumSize-this.config.minimumSize+1)+this.config.minimumSize;
			var D = getRandomInt(this.config.maximumSize-this.config.minimumSize+1)+this.config.minimumSize;
			
			this.rooms[this.roomNumberCreated]= new Room(A,B,C,D);
			
			if(this.rooms[this.roomNumberCreated].isOutOfMap(this.config.sizeX,this.config.sizeY))
			{
				continue;
			}
			
			var valid = true;
			
			for (var i=0;i<this.roomNumberCreated;i++)
			{
				if(this.rooms[i].isOver(this.rooms[this.roomNumberCreated]))
				{
					valid = false;
				}
			}
			if(valid===true)
			{
				this.roomNumberCreated++;
			}
		}
		
		var centers=[];
		for (var i=0;i<this.rooms.length;i++)
		{
			centers[i]=[this.rooms[i].centerX,this.rooms[i].centerY]
		}
		
		var triangles = Delaunator.from(centers);
		
		for (var i=0;i< triangles.triangles.length;i+=3)
		{
			var temp = [triangles.triangles[i],triangles.triangles[i+1],triangles.triangles[i+2]];
			temp.sort(function(a,b){return a-b});
			var add1 = true;
			var add2 = true;
			var add3 = true;
			for (var j=0;j<this.corridors.length;j++)
			{
				if((this.corridors[j][0]-temp[0]===0)&&(this.corridors[j][1]-temp[1]===0))
				{
					add1= false;
				}
				if((this.corridors[j][0]-temp[1]===0)&&(this.corridors[j][1]-temp[2]===0))
				{
					add2= false;
				}
				if((this.corridors[j][0]-temp[0]===0)&&(this.corridors[j][1]-temp[2]===0))
				{
					add3= false;
				}
			}
			
			if(add1)
			{
				this.corridors.push([temp[0],temp[1]]);
			}
			if(add2)
			{
				this.corridors.push([temp[1],temp[2]]);
			}
			if(add3)
			{
				this.corridors.push([temp[0],temp[2]]);
			}
		}
		
		
		for (var i=0;i<this.rooms.length;i++)
		{
			var a=this.rooms[i].posX;
			var b=this.rooms[i].posY;
			var c=this.rooms[i].sizeX;
			var d=this.rooms[i].sizeY;
			
			for (var s=a;s<a+c;s++)
			{
				for (var t=b;t<b+d;t++)
				{
					this.map[s][t]=1;
				}
			}
		}
		
		for (var i=0;i<this.corridors.length;i++)
		{
			var lenX = centers[this.corridors[i][0]][0] - centers[this.corridors[i][1]][0];
			var lenY = centers[this.corridors[i][0]][1] - centers[this.corridors[i][1]][1];
			
			var AX = centers[this.corridors[i][0]][0];
			var BX = centers[this.corridors[i][1]][0];
			
			var AY = centers[this.corridors[i][0]][1];
			var BY = centers[this.corridors[i][1]][1];
			
			//console.log(AX);
			
			var chemin = [];
			
			if (AX>=BX)
			{
				for (var t=BX;t<=AX;t++)
				{
					chemin.push([t,BY]);
				}
			} else 
			{
				for (var t=BX;t>=AX;t--)
				{
					chemin.push([t,BY]);
				}
			}
			
			if (AY>=BY)
			{
				for (var t=BY;t<=AY;t++)
				{
					chemin.push([AX,t]);
				}
			} else {
				for (var t=BY;t>=AY;t--)
				{
					chemin.push([AX,t]);
				}
			}
			//console.log(chemin);
			for (var z=0; z<chemin.length;z++)
			{
				this.map[chemin[z][0]][chemin[z][1]]=1;
			}
		}
		return(this.map);
	}
	

	generateObject()
	{
		return Items.addItems(this.rooms, this.config.items);
	}
	
	/**
	 * add additional terrains like water, lava or abyss
	 * @param {Number} tileNumber unknwown effect, the bigger, the more lake ther is 
	 * @param {MDO_TERRAIN} terrain the MDO_TERRAIN defined in enums.js
	 */
	addExtras(tileNumber, terrain)
	{
		var cover = 0;
		var minsize=2;
		var lenY=this.map.length;
		var lenX=this.map[0].length;
		
		while (cover<tileNumber){
			var maxsize=Math.ceil(Math.sqrt(tileNumber-cover)*Math.min(lenY,lenX)/10);
		
			var posX=getRandomInt(lenX-minsize);
			var posY=getRandomInt(lenY-minsize);
		
			var sizeX=minsize+getRandomInt(Math.min(lenX-posX-minsize,maxsize));
			var sizeY=minsize+getRandomInt(Math.min(lenY-posY-minsize,maxsize));
		
			for(var i=posY;i<posY+sizeY;i++)
			{
				for(var j=posX;j<posX+sizeX;j++)
				{
					if(this.map[i][j]!==1)
					{
						this.map[i][j]=terrain;
					}
					cover++;
				}
			}
		}
		
		return(this.map);
		
	}
	/**
	 * export given map to the given path (csv intended)
	 */
	static exportMapToCsv(map, path) {
		return new Promise(
			function(resolve, reject){
				let mapString = mapToString(map);
				var stream = fs.createWriteStream(path);
				stream.once('open', function(fd) {
				stream.write(mapString);
				stream.end();
				});
				resolve();
			})
	}
	
	/**
	 * used to convert array to array like string
	 * ex : 
	 * 0 0 0 \n
	 * 0 1 0 \n
	 * 0 1 1 \n
	 * 1 1 0 \n
	 */
	static mapToString(map) {
		let mapString = "";
		for (let i = 0; i < map.length; i++) {
			mapString += map[i];
			mapString += "\n";
		}
		return mapString;
	}
	
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/*
Doc de la this.config de generateMap :

sizeX: taille de la carte ( abcisse )
sizeY: taille de la carte ( ordonnees )

RoomCount: nombre de salles

minimumSize: taille minimale d'une salle ( taille en X ou en Y )
maximumSize: taille maximale d'une salle ( taille en X ou en Y )

var this.config = {
	sizeX:30,
	sizeY:30,
	RoomCount:6,
	minimumSize:3,
	maximumSize:9
};
*/
module.exports = GenerationEngine;
//generateMap(this.config);