class Room{
	constructor(posX,posY,sizeX,sizeY){
		this.posX=posX;
		this.posY=posY;
		this.sizeX=sizeX;
		this.sizeY=sizeY;
	}
	
	get centerX() {
		return(this.posX+Math.floor(this.sizeX/2));
	}
	
	get centerY() {
		return(this.posY+Math.floor(this.sizeY/2));
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

module.exports = Room;