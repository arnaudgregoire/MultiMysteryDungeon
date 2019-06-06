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


function generateMap(config){
	
	// level map initialization
	
	var level =new Array(config.sizeY);
	for (var i=0; i<config.sizeY; i++){
		level[i]=new Array(config.sizeX);
		for (var j=0; j<config.sizeX; j++){
			level[i][j]=0;
		}
	}
	
	
	var RoomNumberCreated = 0;
	var Rooms = [];
	
	while(RoomNumberCreated<config.RoomCount){
		var A=getRandomInt(config.sizeY-config.minimumSize-1)+1
		var B=getRandomInt(config.sizeX-config.minimumSize-1)+1
		var C = getRandomInt(config.maximumSize-config.minimumSize+1)+config.minimumSize;
		var D = getRandomInt(config.maximumSize-config.minimumSize+1)+config.minimumSize;
		
		Rooms[RoomNumberCreated]= new Room(A,B,C,D);
		
		if(Rooms[RoomNumberCreated].isOutOfMap(config.sizeX,config.sizeY)){
			continue;
		}
		
		var valid = true;
		
		for (var i=0;i<RoomNumberCreated;i++){
			if(Rooms[i].isOver(Rooms[RoomNumberCreated])){
				valid = false;
			}
		}
		if(valid===true){
			RoomNumberCreated++;
		}
		
			
	}
	
	var centers=[];
	for (var i=0;i<Rooms.length;i++){
		centers[i]=[Rooms[i].centerX,Rooms[i].centerY]
	}
	
	//console.log(centers);
	
	var triangles = Delaunator.from(centers);
	
	//console.log(triangles);
	
	var corridors=[];
	
	for (var i=0;i< triangles.triangles.length;i+=3){
		var temp = [triangles.triangles[i],triangles.triangles[i+1],triangles.triangles[i+2]];
		temp.sort(function(a,b){return a-b});
		var add1 = true;
		var add2 = true;
		var add3 = true;
		for (var j=0;j<corridors.length;j++){
			if((corridors[j][0]-temp[0]===0)&&(corridors[j][1]-temp[1]===0)){
				add1= false;
			}
			if((corridors[j][0]-temp[1]===0)&&(corridors[j][1]-temp[2]===0)){
				add2= false;
			}
			if((corridors[j][0]-temp[0]===0)&&(corridors[j][1]-temp[2]===0)){
				add3= false;
			}
		}
		
		if(add1){
			corridors.push([temp[0],temp[1]]);
		}
		if(add2){
			corridors.push([temp[1],temp[2]]);
		}
		if(add3){
			corridors.push([temp[0],temp[2]]);
		}
	}
	
	//console.log(corridors);
	
	for (var i=0;i<Rooms.length;i++){
		var a=Rooms[i].posX;
		var b=Rooms[i].posY;
		var c=Rooms[i].sizeX;
		var d=Rooms[i].sizeY;
		
		
		for (var s=a;s<a+c;s++){
			for (var t=b;t<b+d;t++){
				level[s][t]=1;
			}
		}
	}
	
	for (var i=0;i<corridors.length;i++){
		var lenX = centers[corridors[i][0]][0] - centers[corridors[i][1]][0];
		var lenY = centers[corridors[i][0]][1] - centers[corridors[i][1]][1];
		
		
		var AX = centers[corridors[i][0]][0];
		var BX = centers[corridors[i][1]][0];
		
		var AY = centers[corridors[i][0]][1];
		var BY = centers[corridors[i][1]][1];
		
		//console.log(AX);
		
		var chemin = [];
		
		if (AX>=BX){
			for (var t=BX;t<=AX;t++){
				chemin.push([t,BY]);
			}
		} else {
			for (var t=BX;t>=AX;t--){
				chemin.push([t,BY]);
			}
		}
		
		if (AY>=BY){
			for (var t=BY;t<=AY;t++){
				chemin.push([AX,t]);
			}
		} else {
			for (var t=BY;t>=AY;t--){
				chemin.push([AX,t]);
			}
		}
		
		//console.log(chemin);
		
		
		for (var z=0; z<chemin.length;z++){
			level[chemin[z][0]][chemin[z][1]]=1;
		}
		
	}
	
	
	/*
	for (var i=0; i<config.sizeY; i++){
		console.log(level[i].join(''));
	}
	*/
	return(level);
}

/**
 * export given map to the given path (csv intended)
 */
function exportMapToCsv(map, path) {
	let mapString = mapToString(map);
	var stream = fs.createWriteStream(path);
	stream.once('open', function(fd) {
	stream.write(mapString);
	stream.end();
	});
}

/**
 * used to convert array to array like string
 * ex : 
 * 0 0 0 \n
 * 0 1 0 \n
 * 0 1 1 \n
 * 1 1 0 \n
 */
function mapToString(map) {
	let mapString = "";
	for (let i = 0; i < map.length; i++) {
		mapString += map[i];
		mapString += "\n";
	}
	return mapString;
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
Doc de la config de generateMap :

sizeX: taille de la carte ( abcisse )
sizeY: taille de la carte ( ordonnees )

RoomCount: nombre de salles

minimumSize: taille minimale d'une salle ( taille en X ou en Y )
maximumSize: taille maximale d'une salle ( taille en X ou en Y )

var config = {
	sizeX:30,
	sizeY:30,
	RoomCount:6,
	minimumSize:3,
	maximumSize:9
};
*/
module.exports = {
	generateMap: generateMap,
	exportMapToCsv: exportMapToCsv,
	mapToString: mapToString

}
//generateMap(config);