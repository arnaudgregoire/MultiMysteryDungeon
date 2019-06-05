class room{
	constructor(posX,posY,sizeX,sizeY){
		this.posX=posX;
		this.posY=posY;
		this.sizeX=sizeX;
		this.sizeY=sizeY;
	}
	
	get centerX() {
		return(posX+floor(sizeX/2));
	}
	
	get centerY() {
		return(posY+floor(sizeY/2));
	}
	
	isOver(otherRoom) {
		var MaxLeft = Math.max(this.posX,otherRoom.posX);
		var MinRight =Math.min(this.posX+this.sizeX,otherRoom.posX+otherRoom.sizeX);
		if((MaxLeft-1)<=(MinRight+1)){
			var MaxHigh = Math.max(this.posY,otherRoom.posY);
			var MinLow = Math.min(this.posY+this.sizeY,otherRoom.posY+otherRoom.sizeY);
			if((MaxHigh-1)<=(MinLow+1)){
				return true;
			}
		} 
		return false;
	}
	
	isOutOfMap(MapSizeX,MapSizeY){
		if(this.posX+this.sizeX>=MapSizeX-1){
			return true;
		}
		if(this.posY+this.sizeY>=MapSizeY-1){
			return true;
		}
		
		return false;
	}
}

class DelaunayTriangle{
	constructor(x1,y1,x2,y2,x3,y3){
		this.x1=x1;
		this.y1=y1;
		this.x2=y2;
		this.y2=y2;
		this.x3=x3;
		this.y3=y3;
	}
	
	get CircleCenter(){
		//return surrounding circle center 
	}
	
	isValid(ListPoints){
		//no point inside the triangle ?
	}
	
	isSurrounding(Point){
		//is the point inside the triangle ?
	}
	
	shift(otherTriangle){
		//shift 2 invalid triangles to produce 2 valid ones
	}
	
	
	
}

function isTriangleValid(Triangle){
	
}

function shift(Triangle1,Triangle2){
	
}

function surroundingTriangle(TriangleList){
	
}

function triangulate(PointList){
	
}


function generateMap(config){
	
	// level map initialization
	
	var level =new Array(config.sizeY);
	for (var i=0; i<config.sizeY; i++){
		level[i]=new Array(config.sizeX);
		for (var j=0; j<config.sizeX; j++){
			level[i][j]='0';
		}
	}
	
	
	var RoomNumberCreated = 0;
	var Rooms = [];
	
	while(RoomNumberCreated<config.RoomCount){
		var A=getRandomInt(config.sizeY-config.minimumSize-1)+1
		var B=getRandomInt(config.sizeX-config.minimumSize-1)+1
		var C = getRandomInt(config.maximumSize-config.minimumSize+1)+config.minimumSize;
		var D = getRandomInt(config.maximumSize-config.minimumSize+1)+config.minimumSize;
		
		Rooms[RoomNumberCreated]= new room(A,B,C,D);
		
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
	
	for (var i=0;i<Rooms.length;i++){
		var a=Rooms[i].posX;
		var b=Rooms[i].posY;
		var c=Rooms[i].sizeX;
		var d=Rooms[i].sizeY;
		
		for (var s=a;s<a+c;s++){
			for (var t=b;t<b+d;t++){
				level[s][t]='#';
			}
		}
	}
	
	
	
	for (var i=0; i<config.sizeY; i++){
		console.log(level[i].join(''));
	}
}





function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


var config = {
	sizeX:30,
	sizeY:30,
	RoomCount:6,
	minimumSize:3,
	maximumSize:9
};

generateMap(config);