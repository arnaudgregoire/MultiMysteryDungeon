class Entity
{
    constructor(x, y, name)
    {
      this.x = x;
      this.y = y;
      this.name = name;
      this.orientation = "left";
      this.action = "5";
      this.turnPlayed = false;
      this.inventory = [];
    }
}

module.exports = Entity;