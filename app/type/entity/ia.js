const Entity = require("./entity");

class Ia extends Entity{
    constructor(uniqid, x, y, name, pokemon){
      super(x,y,name);
      this.entityType = 'ia';
      this.pokemon = pokemon;
      this.uniqid = uniqid;
    }
  }

  module.exports = Ia;